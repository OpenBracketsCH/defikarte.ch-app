using Newtonsoft.Json.Linq;
using System;

namespace DefikarteBackend.Cache
{
    public class SimpleCache : ISimpleCache
    {
        private JToken DefibrillatorElementsCache { get; set; }

        public DateTimeOffset LastUpdate { get; private set; }

        public void Update(JToken newCache)
        {
            if (newCache != null && newCache.HasValues)
            {
                this.DefibrillatorElementsCache = newCache;
                this.LastUpdate = DateTimeOffset.Now;
            }
        }

        /// <summary>
        /// Gets the current cache, if it is not older than 5min
        /// </summary>
        /// <returns>JSON-Token with all defi-elements (array), null if not up-to-date</returns>
        public JToken TryGetLegalCache()
        {
            if (DateTimeOffset.Now - this.LastUpdate <= new TimeSpan(0, 5, 0))
            {
                return this.DefibrillatorElementsCache;
            }

            return null;
        }
    }
}
