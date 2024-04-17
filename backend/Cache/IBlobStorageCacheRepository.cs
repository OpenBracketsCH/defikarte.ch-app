using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    public interface IBlobStorageCacheRepository
    {
        Task CreateAsync(string jsonData, string blobName);

        Task<string> ReadAsync(string blobName);

        Task UpdateAsync(string jsonData, string blobName);

        Task DeleteAsync(string blobName);
    }
}