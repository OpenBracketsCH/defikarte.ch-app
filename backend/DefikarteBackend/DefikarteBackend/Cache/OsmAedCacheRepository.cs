using DefikarteBackend.Configuration;
using DefikarteBackend.Model;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    public class OsmAedCacheRepository : ICacheRepository
    {
        private readonly FeedOptions _defaultFeedOptions = new() { EnableCrossPartitionQuery = true };
        private readonly string _databaseName;
        private readonly string _collectionName;
        private readonly IDocumentClient _documentClient;
        private readonly ServiceConfiguration _serviceConfiguration;
        private readonly ILogger<OsmAedCacheRepository> _log;

        public OsmAedCacheRepository(IDocumentClient documentClient, ServiceConfiguration serviceConfiguration, ILogger<OsmAedCacheRepository> log)
        {
            _documentClient = documentClient;
            _serviceConfiguration = serviceConfiguration;
            _log = log;

            _databaseName = _serviceConfiguration.DatabaseName;
            _collectionName = _serviceConfiguration.CacheCollectionName;
        }

        public async Task<bool> TryUpdateCacheAsync(IList<OsmNode> values)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            bool success = false;
            if (values != null && values.Count > 0)
            {
                var tasks = new List<Task>();
                foreach (var osmNode in values)
                {
                    osmNode.TimeToLife = 86400;
                    var task = AddOrUpdateItemAsync(osmNode);
                    tasks.Add(task);
                }

                var currentIds = values.Select(x => x.Id).ToList();
                var documentsToDelete = GetItemsExcludeById(currentIds);
                foreach (var document in documentsToDelete)
                {
                    var documentId = document.Id;
                    var delTask = DeleteItemAsync(documentId);
                    tasks.Add(delTask);
                }

                await Task.WhenAll(tasks);
                success = true;
            }

            stopwatch.Stop();
            _log.LogInformation($"Finish TryUpdateCacheAsync after:{stopwatch.ElapsedMilliseconds}ms");
            return success;
        }

        public IList<OsmNode> Get()
        {
            Uri documentCollectionUri = UriFactory.CreateDocumentCollectionUri(_databaseName, _collectionName);
            return _documentClient.CreateDocumentQuery<OsmNode>(documentCollectionUri, _defaultFeedOptions).ToList();
        }

        public async Task<OsmNode> GetByIdAsync(string id)
        {
            var options = new RequestOptions { PartitionKey = new PartitionKey(id) };
            return await _documentClient.ReadDocumentAsync<OsmNode>(
                UriFactory.CreateDocumentUri(_databaseName, _collectionName, id), options).ConfigureAwait(false);
        }

        private List<OsmNode> GetItemsExcludeById(List<string> excludeIds)
        {
            Uri documentCollectionUri = UriFactory.CreateDocumentCollectionUri(_databaseName, _collectionName);
            var documentsToDelete = _documentClient
                .CreateDocumentQuery<OsmNode>(documentCollectionUri, _defaultFeedOptions)
                .Where(n => !excludeIds.Contains(n.Id)).ToList();
            return documentsToDelete;
        }

        private async Task<ResourceResponse<Document>> AddOrUpdateItemAsync(OsmNode osmNode)
        {
            var options = new RequestOptions { PartitionKey = new PartitionKey(osmNode.Id) };
            return await _documentClient.UpsertDocumentAsync(
                 UriFactory.CreateDocumentCollectionUri(_databaseName, _collectionName), osmNode, options);
        }

        private async Task<ResourceResponse<Document>> DeleteItemAsync(string documentId)
        {
            var options = new RequestOptions { PartitionKey = new PartitionKey(documentId) };
            return await _documentClient.DeleteDocumentAsync(
                 UriFactory.CreateDocumentUri(_databaseName, _collectionName, documentId), options: options);
        }
    }
}