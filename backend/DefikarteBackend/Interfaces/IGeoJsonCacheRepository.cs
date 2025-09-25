using DefikarteBackend.Model;

namespace DefikarteBackend.Interfaces
{
    public interface IGeoJsonCacheRepository
    {
        public DataSourceType DataSourceType { get; }

        Task<bool> ExistsAsync();

        Task<FeatureCollection> GetAsync();

        Task<string> GetRawAsync();

        Task<Feature?> GetByIdAsync(string id);

        Task<bool> TryUpdateCacheAsync(FeatureCollection values);
    }
}
