using DefikarteBackend.Model;

namespace DefikarteBackend.Interfaces
{
    public interface IGeoJsonCacheRepository
    {
        public DataSourceType DataSourceType { get; }

        Task<FeatureCollection> GetAsync();

        Task<Feature?> GetByIdAsync(string id);

        Task<bool> TryUpdateCacheAsync(FeatureCollection values);
    }
}
