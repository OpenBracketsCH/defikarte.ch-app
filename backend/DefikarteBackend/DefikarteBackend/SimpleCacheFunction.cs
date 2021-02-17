using System;
using System.Threading.Tasks;
using DefikarteBackend.Cache;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class SimpleCacheFunction
    {
        private readonly IConfigurationRoot config;
        private readonly ISimpleCache cache;

        public SimpleCacheFunction(IConfigurationRoot config, ISimpleCache cache)
        {
            this.config = config;
            this.cache = cache;
        }

        [FunctionName("SimpleCacheFunction")]
        public async Task RunAsync([TimerTrigger("0 */1 * * * *")] TimerInfo myTimer, ILogger log)
        {
            var overpassApiUrl = this.config["overpassUrl"];
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var success = cache.TryUpdateCache(response);
                log.LogInformation($"Updated cache({this.cache.CacheId}) successful:{success}. LastUpdate:{this.cache.LastUpdate}");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }
        }
    }
}
