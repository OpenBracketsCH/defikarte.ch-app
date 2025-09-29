using DefikarteBackend.Helpers;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend.Functions
{
    public class SimpleCacheTimer
    {
        private readonly ILogger<SimpleCacheTimer> _logger;
        private readonly IServiceConfiguration _config;
        private readonly ICacheRepository<OsmNode> _cacheRepository;
        private readonly IUpdateGeoJsonCacheService _updateGeoJsonCacheService;

        public SimpleCacheTimer(
            ILogger<SimpleCacheTimer> logger,
            IServiceConfiguration config,
            ICacheRepository<OsmNode> cacheRepository,
            IUpdateGeoJsonCacheService updateGeoJsonCacheService)
        {
            _logger = logger;
            _config = config;
            _cacheRepository = cacheRepository;
            _updateGeoJsonCacheService = updateGeoJsonCacheService;
        }

        [Function(nameof(SimpleCacheTimer))]
        public async Task RunAsync([TimerTrigger("0 */15 * * * *", RunOnStartup = true)] TimerInfo myTimer)
        {
            try
            {
                await _updateGeoJsonCacheService.CleanupOldItemsInLocalCacheAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occured while tried to CleanupOldItemsInLocalCacheAsync. Continue update chache in {nameof(SimpleCacheTimer)}.");
            }

            var overpassApiUrl = _config.OverpassApiUrl;
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var cacheV1Task = _cacheRepository.TryUpdateCacheAsync(response);
                var cacheV2Task = _updateGeoJsonCacheService.TryUpdateAndCombineCacheAsync(GeoJsonConverter.Convert2GeoJson(response));

                var results = await Task.WhenAll(cacheV1Task, cacheV2Task);
                _logger.LogInformation($"Updated cache successful:{results.All(x => x)}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error running {nameof(SimpleCacheTimer)}");
            }
        }


    }
}