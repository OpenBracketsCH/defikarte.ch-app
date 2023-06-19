using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    public interface ISimpleCache
    {
        Task<JArray> TryGetLegalCache();

        Task<bool> TryUpdateCache(JArray newCache);
    }
}