using DefikarteBackend.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    public interface ICacheRepository
    {
        IList<OsmNode> Get();

        Task<OsmNode> GetByIdAsync(string id);

        Task<bool> TryUpdateCacheAsync(IList<OsmNode> values);
    }
}