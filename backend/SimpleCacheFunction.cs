using System;
using System.Threading.Tasks;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class SimpleCacheFunction
    {
        private readonly ServiceConfiguration _config;
        private readonly ICacheRepository<OsmNode> _cacheRepository;

        public SimpleCacheFunction(ServiceConfiguration config, ICacheRepository<OsmNode> cacheRepository)
        {
            _config = config;
            _cacheRepository = cacheRepository;
        }

        [FunctionName("SimpleCacheFunction")]
        public async Task RunAsync([TimerTrigger("0 */15 * * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log)
        {
            var overpassApiUrl = _config.OverpassApiUrl;
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var success = await _cacheRepository.TryUpdateCacheAsync(response);
                log.LogInformation($"Updated cache sucessful:{success}");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }
        }
    }
}