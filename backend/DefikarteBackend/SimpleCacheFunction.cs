using DefikarteBackend.Helpers;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class SimpleCacheFunction
    {
        private readonly ILogger<SimpleCacheFunction> _logger;
        private readonly IServiceConfiguration _config;
        private readonly ICacheRepository<OsmNode> _cacheRepository;
        private readonly IGeoJsonCacheRepository _geoJsonCacheRepository;

        public SimpleCacheFunction(
            ILogger<SimpleCacheFunction> logger,
            IServiceConfiguration config,
            ICacheRepository<OsmNode> cacheRepository,
            IGeoJsonCacheRepository geoJsonCacheRepository)
        {
            _logger = logger;
            _config = config;
            _cacheRepository = cacheRepository;
            _geoJsonCacheRepository = geoJsonCacheRepository;
        }

        [Function(nameof(SimpleCacheFunction))]
        public async Task RunAsync([TimerTrigger("0 */15 * * * *", RunOnStartup = true)] TimerInfo myTimer)
        {
            var overpassApiUrl = _config.OverpassApiUrl;
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var cacheV1Task = _cacheRepository.TryUpdateCacheAsync(response);
                var cacheV2Task = _geoJsonCacheRepository.TryUpdateCacheAsync(GeoJsonConverter.Convert2GeoJson(response));

                var results = await Task.WhenAll(cacheV1Task, cacheV2Task);
                _logger.LogInformation($"Updated cache sucessful:{results.All(x => x)}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
            }
        }


    }
}