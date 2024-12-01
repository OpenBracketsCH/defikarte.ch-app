using System.Threading.Tasks;

namespace DefikarteBackend.Interfaces
{
    public interface IBlobStorageCacheRepository
    {
        Task CreateAsync(string jsonData, string blobName);

        Task<string> ReadAsync(string blobName);

        Task UpdateAsync(string jsonData, string blobName);

        Task DeleteAsync(string blobName);
    }
}