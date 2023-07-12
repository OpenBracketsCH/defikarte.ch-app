using Azure.Storage.Blobs;
using DefikarteBackend.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace DefikarteBackend.Cache
{
    public interface IBlobStorageCacheRepository
    {
        Task CreateAsync(string jsonData, string blobName);

        Task<string> ReadAsync(string blobName);

        Task UpdateAsync(string jsonData, string blobName);

        Task DeleteAsync(string blobName);
    }

    public class BlobStorageCacheRepository : IBlobStorageCacheRepository, ICacheRepository<OsmNode>
    {
        private readonly BlobContainerClient _containerClient;
        private readonly string _blobName;

        public BlobStorageCacheRepository(BlobContainerClient containerClient, string blobName)
        {
            _containerClient = containerClient;
            _blobName = blobName;
        }

        public async Task CreateAsync(string jsonData, string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(BinaryData.FromString(jsonData));
        }

        public async Task<string> ReadAsync(string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            var response = await blobClient.DownloadContentAsync();
            var content = response.Value.Content;
            return Encoding.UTF8.GetString(content);
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

        public async Task<IList<OsmNode>> GetAsync()
        {
            var content = await ReadAsync(_blobName);
            return JsonConvert.DeserializeObject<List<OsmNode>>(content);
        }

        public async Task<OsmNode> GetByIdAsync(string id)
        {
            return (await GetAsync()).FirstOrDefault(x => x.Id == id);
        }

        public async Task<bool> TryUpdateCacheAsync(IList<OsmNode> values)
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