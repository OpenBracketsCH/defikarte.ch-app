using Newtonsoft.Json.Linq;
using System;

namespace DefikarteBackend.Cache
{
    public interface ISimpleCache
    {
        Guid CacheId { get; }

        DateTimeOffset LastUpdate { get; }

        bool TryGetLegalCache(out JToken response);

        bool TryUpdateCache(JToken newCache);
    }
}