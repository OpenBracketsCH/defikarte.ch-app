using DefikarteBackend.Model;
using Microsoft.Azure.Documents;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    public interface ICacheRepository
    {
        IList<Document> Get();

        Task<OsmNode> GetByIdAsync(string id);

        Task<bool> TryUpdateCacheAsync(IList<OsmNode> values);
    }
}