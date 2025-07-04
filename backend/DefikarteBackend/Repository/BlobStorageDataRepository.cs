using Azure.Storage.Blobs;
using DefikarteBackend.Interfaces;
using System.Text;

namespace DefikarteBackend.Repository
{
    public class BlobStorageDataRepository : IBlobStorageDataRepository
    {
        private readonly BlobContainerClient _containerClient;

        public BlobStorageDataRepository(BlobContainerClient containerClient)
        {
            _containerClient = containerClient;
        }

        public async Task CreateAsync(string jsonData, string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(BinaryData.FromString(jsonData));
        }

        public async Task<string> ReadAsync(string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            var exists = await blobClient.ExistsAsync();
            if (!exists)
            {
                return string.Empty;
            }

            var response = await blobClient.DownloadContentAsync();
            var content = response.Value.Content;
            return Encoding.UTF8.GetString(content);
        }
    }
}
