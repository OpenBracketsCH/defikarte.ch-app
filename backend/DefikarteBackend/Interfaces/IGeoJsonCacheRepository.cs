using DefikarteBackend.Model;
using System.Threading.Tasks;

namespace DefikarteBackend.Interfaces
{
    public interface IGeoJsonCacheRepository
    {
        Task<FeatureCollection> GetAsync();

        Task<Feature> GetByIdAsync(string id);

        Task<bool> TryUpdateCacheAsync(FeatureCollection values);
    }
}
