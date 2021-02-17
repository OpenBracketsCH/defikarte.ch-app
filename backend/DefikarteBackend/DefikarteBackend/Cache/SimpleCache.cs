using Newtonsoft.Json.Linq;
using System;

namespace DefikarteBackend.Cache
{
    public class SimpleCache : ISimpleCache
    {
        public SimpleCache()
        {
            this.CacheId = Guid.NewGuid();
        }

        private JToken DefibrillatorElementsCache { get; set; }

        public DateTimeOffset LastUpdate { get; private set; }

        public Guid CacheId { get; private set; }

        public bool TryUpdateCache(JToken newCache)
        {
            bool success = false;
            if (newCache != null && newCache.HasValues)
            {
                this.DefibrillatorElementsCache = newCache;
                this.LastUpdate = DateTimeOffset.Now;
                success = true;
            }

            return success;
        }

        /// <summary>
        /// Gets the current cache, if it is not older than 24h
        /// </summary>
        /// <param name="response">JSON-Token with all defi-elements (array), null if not up-to-date</param>
        /// <returns>true if a legal cache is available</returns>
        public bool TryGetLegalCache(out JToken response)
        {
            bool success;
            if (DateTimeOffset.Now - this.LastUpdate <= new TimeSpan(24, 0, 0)
                && this.DefibrillatorElementsCache != null 
                && this.DefibrillatorElementsCache.HasValues)
            {
                response = this.DefibrillatorElementsCache;
                success = true;
            }
            else
            {
                response = null;
                success = false;
            }

            return success;
        }
    }
}
