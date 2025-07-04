using Azure.Storage.Blobs;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.Repository;
using Newtonsoft.Json;

namespace DefikarteBackend.Cache
{
    public class BlobStorageCacheRepositoryV2 : BlobStorageDataRepository, IBlobStorageCacheRepository, IGeoJsonCacheRepository
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

        public async Task UpdateAsync(string jsonData, string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(BinaryData.FromString(jsonData), overwrite: true);
        }

        public async Task DeleteAsync(string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<FeatureCollection> GetAsync()
        {
            var content = await ReadAsync(_blobName);
            if (string.IsNullOrEmpty(content))
            {
                return new FeatureCollection();
            }

            return JsonConvert.DeserializeObject<FeatureCollection>(content) ?? new FeatureCollection();
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
                await UpdateAsync(JsonConvert.SerializeObject(values), _blobName);
                success = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return success;
        }
    }
}