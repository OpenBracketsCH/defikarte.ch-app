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

            using var memoryStream = new MemoryStream();
            await blobClient.DownloadToAsync(memoryStream).ConfigureAwait(false);
            return Encoding.UTF8.GetString(memoryStream.ToArray());
        }

        public async Task<bool> ExistsAsync(string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            return await blobClient.ExistsAsync();
        }
    }
}
