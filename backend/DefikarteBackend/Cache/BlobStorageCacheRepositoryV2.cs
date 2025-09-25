using Azure.Storage.Blobs;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.Repository;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DefikarteBackend.Cache
{
    public class BlobStorageCacheRepositoryV2 : BlobStorageDataRepository, IGeoJsonCacheRepository
    {
        private readonly BlobContainerClient _containerClient;
        private readonly string _blobName;

        public DataSourceType DataSourceType { get; }

        public BlobStorageCacheRepositoryV2(BlobContainerClient containerClient, string blobName, DataSourceType dataSourceType)
            : base(containerClient)
        {
            _containerClient = containerClient;
            _blobName = blobName;
            DataSourceType = dataSourceType;
        }

        public async Task<FeatureCollection> GetAsync()
        {
            string content = await ReadAsync(_blobName);
            if (string.IsNullOrWhiteSpace(content))
            {
                return new FeatureCollection();
            }

            return JsonConvert.DeserializeObject<FeatureCollection>(content) ?? new FeatureCollection();
        }

        public async Task<string> GetRawAsync()
        {
            return await ReadAsync(_blobName);
        }

        public async Task<Feature?> GetByIdAsync(string id)
        {
            return (await GetAsync()).Features.FirstOrDefault(x => x.Id == id);
        }

        public async Task<bool> TryUpdateCacheAsync(FeatureCollection values)
        {
            var success = false;
            try
            {
                var serializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy()
                    }
                };

                await UpdateAsync(JsonConvert.SerializeObject(values, serializerSettings), _blobName);
                success = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return success;
        }

        public async Task<bool> ExistsAsync()
        {
            return await ExistsAsync(_blobName);
        }

        private async Task UpdateAsync(string jsonData, string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(BinaryData.FromString(jsonData), overwrite: true);
        }
    }
}