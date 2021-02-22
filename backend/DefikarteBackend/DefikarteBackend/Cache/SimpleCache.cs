using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DefikarteBackend.Cache
{
    [JsonObject(MemberSerialization = MemberSerialization.OptIn)]
    public class SimpleCache : ISimpleCache
    {
        public SimpleCache()
        {
            this.CacheId = Guid.NewGuid();
        }

        [JsonProperty("defibrillators")]
        public List<object> DefibrillatorElementsCache { get; set; }

        [JsonProperty("lastUpdate")]
        public DateTimeOffset LastUpdate { get; private set; }

        [JsonProperty("id")]
        public Guid CacheId { get; private set; }

        public Task<bool> TryUpdateCache(JArray newCache)
        {
            bool success = false;
            if (newCache != null && newCache.HasValues)
            {
                this.DefibrillatorElementsCache = newCache.ToObject<List<object>>();
                this.LastUpdate = DateTimeOffset.Now;
                success = true;
            }

            return Task.FromResult(success);
        }

        /// <summary>
        /// Gets the current cache, if it is not older than 24h
        /// </summary>
        /// <param name="response">JSON-Token with all defi-elements (array), null if not up-to-date</param>
        /// <returns>true if a legal cache is available</returns>
        public Task<JArray> TryGetLegalCache()
        {
            JArray response;
            if (DateTimeOffset.Now - this.LastUpdate <= new TimeSpan(24, 0, 0)
                && this.DefibrillatorElementsCache != null
                )
            {
                response = JArray.FromObject(this.DefibrillatorElementsCache);
            }
            else
            {
                response = null;
            }

            return Task.FromResult(response);
        }

        [FunctionName(nameof(SimpleCache))]
        public static Task Run([EntityTrigger] IDurableEntityContext ctx)
            => ctx.DispatchAsync<SimpleCache>();
    }
}
