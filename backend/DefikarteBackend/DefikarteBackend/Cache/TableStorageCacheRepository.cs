using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Threading.Tasks;
using DefikarteBackend.Model;
using System.Collections.Generic;
using System.Linq;

namespace DefikarteBackend.Cache
{

    public static class TableStorageFunction
    {
        private static readonly string _connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
        private static readonly CloudTableClient _tableClient = CloudStorageAccount.Parse(_connectionString).CreateCloudTableClient();
        private static readonly CloudTable _table = _tableClient.GetTableReference("deficache");

        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req, ILogger log)
        {
            var repository = new TableStorageCacheRepository<OsmNode>(_table);

            var entityToInsert = new OsmNode();
            await repository.InsertAsync(entityToInsert);

            var retrievedEntity = await repository.RetrieveAsync(entityToInsert.PartitionKey, entityToInsert.RowKey);

            return new OkObjectResult(retrievedEntity);
        }
    }

    public class TableStorageCacheRepository<T> : ICacheRepository<T> where T : ITableEntity, new()
    {
        private readonly CloudTable _table;

        public TableStorageCacheRepository(CloudTable table)
        {
            _table = table;
        }

        public async Task<IList<T>> GetAsync()
        {
            var result = await this.RetrieveAllAsync().ConfigureAwait(false);
            return result.ToList();
        }

        public Task<T> GetByIdAsync(string id)
        {
            return this.RetrieveAsync("id", id);
        }

        public async Task<bool> TryUpdateCacheAsync(IList<T> values)
        {
            var result = false;
            try
            {
                await this.DeleteAllAsync().ConfigureAwait(false);
                await this.InsertAllAsync(values).ConfigureAwait(false);
                result = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

        public async Task InsertAllAsync(IList<T> entities)
        {
            var batches = entities
                .Select((entity, index) => new { entity, index })
                .GroupBy(x => x.index / 100)
                .Select(batch => batch.Select(x => x.entity))
                .Select(batchEntities =>
                {
                    var batch = new TableBatchOperation();
                    foreach(var entity in batchEntities)
                    {
                        batch.InsertOrReplace(entity);
                    }

                    return batch;
                });

            foreach (var batch in batches)
            {
                await _table.ExecuteBatchAsync(batch);
            }
        }

        public async Task InsertAsync(T entity)
        {
            var insertOperation = TableOperation.Insert(entity);
            await _table.ExecuteAsync(insertOperation);
        }

        public async Task<T> RetrieveAsync(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<T>(partitionKey, rowKey);
            var result = await _table.ExecuteAsync(retrieveOperation);
            return (T)result.Result;
        }

        public async Task<IEnumerable<T>> RetrieveAllAsync()
        {
            var results = new List<T>();
            TableQuery<T> query = new TableQuery<T>();
            TableContinuationToken token = null;

            do
            {
                var segment = await _table.ExecuteQuerySegmentedAsync(query, token);
                token = segment.ContinuationToken;
                results.AddRange(segment.Results);
            } while (token != null);

            return results;
        }

        public async Task DeleteAllAsync()
        {
            var query = new TableQuery<T>();
            TableContinuationToken token = null;
            var batch = new TableBatchOperation();

            do
            {
                var segment = await _table.ExecuteQuerySegmentedAsync(query, token);
                token = segment.ContinuationToken;
                foreach (var entity in segment)
                {
                    batch.Delete(entity);
                    if (batch.Count == 100)
                    {
                        await _table.ExecuteBatchAsync(batch);
                        batch.Clear();
                    }
                }
            } while (token != null);

            if (batch.Count > 0)
            {
                await _table.ExecuteBatchAsync(batch);
            }
        }
    }
}