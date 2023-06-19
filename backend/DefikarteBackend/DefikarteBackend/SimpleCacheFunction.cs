using System;
using System.Threading.Tasks;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class SimpleCacheFunction
    {
        private readonly ServiceConfiguration _config;
        private readonly ICacheRepository _simpleCache;

        public SimpleCacheFunction(ServiceConfiguration config, ICacheRepository simpleCache)
        {
            _config = config;
            _simpleCache = simpleCache;
        }

        [FunctionName("SimpleCacheFunction")]
        public async Task RunAsync([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
        {
            var overpassApiUrl = _config.OverpassApiUrl;
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var success = await _simpleCache.TryUpdateCacheAsync(response);
                log.LogInformation($"Updated cache sucessful:{success}");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }
        }
    }
}