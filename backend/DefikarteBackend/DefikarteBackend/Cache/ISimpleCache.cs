using Newtonsoft.Json.Linq;

namespace DefikarteBackend.Cache
{
    public interface ISimpleCache
    {
        JToken TryGetLegalCache();

        void Update(JToken newCache);
    }
}