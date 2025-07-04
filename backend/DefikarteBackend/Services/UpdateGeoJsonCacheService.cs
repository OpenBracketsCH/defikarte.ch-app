using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend.Services
{
    public class UpdateGeoJsonCacheService : IUpdateGeoJsonCacheService
    {
        private readonly ILogger<UpdateGeoJsonCacheService> _logger;
        private readonly IEnumerable<IGeoJsonCacheRepository> _geoJsonCacheRepositories;

        public UpdateGeoJsonCacheService(
            ILogger<UpdateGeoJsonCacheService> logger,
            IServiceConfiguration config,
            ICacheRepository<OsmNode> cacheRepository,
            IEnumerable<IGeoJsonCacheRepository> geoJsonCacheRepository)
        {
            _logger = logger;
            _geoJsonCacheRepositories = geoJsonCacheRepository;
        }

        public async Task<bool> TryUpdateAndCombineCacheAsync(FeatureCollection geoJson)
        {
            var localCacheRepository = _geoJsonCacheRepositories.FirstOrDefault(x => x.DataSourceType == DataSourceType.Local);
            var osmCacheRepository = _geoJsonCacheRepositories.FirstOrDefault(x => x.DataSourceType == DataSourceType.Osm);
            if (localCacheRepository == null && osmCacheRepository != null)
            {
                return await osmCacheRepository.TryUpdateCacheAsync(geoJson).ConfigureAwait(false);
            }

            if (localCacheRepository != null && osmCacheRepository != null)
            {
                var temporaryData = await localCacheRepository.GetAsync().ConfigureAwait(false);
                AddOrUpdateItems(temporaryData, geoJson);
                return await osmCacheRepository.TryUpdateCacheAsync(geoJson).ConfigureAwait(false);
            }

            return false;
        }

        public async Task CleanupOldItemsInLocalCacheAsync()
        {
            try
            {
                var localCacheRepository = _geoJsonCacheRepositories.FirstOrDefault(x => x.DataSourceType == DataSourceType.Local);

                if (localCacheRepository == null)
                {
                    return; // No cache to cleanse
                }

                var currentTime = DateTime.UtcNow;
                var oneHourAgo = currentTime.AddHours(-1);

                var geoJson = await localCacheRepository.GetAsync().ConfigureAwait(false);

                geoJson.Features.RemoveAll(feature =>
                {
                    if (feature.Properties.TryGetValue("timestamp", out var timestampObj) && timestampObj is string timestampStr)
                    {
                        if (DateTime.TryParseExact(
                                timestampStr,
                                "yyyy-MM-dd HH:mm:ssZ",
                                System.Globalization.CultureInfo.InvariantCulture,
                                System.Globalization.DateTimeStyles.AssumeUniversal,
                                out var timestamp))
                        {
                            return timestamp < oneHourAgo;
                        }
                    }
                    return false;
                });

                await localCacheRepository.TryUpdateCacheAsync(geoJson).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error {nameof(CleanupOldItemsInLocalCacheAsync)}");
            }
        }

        public async Task AddOrUpdateFeaturesInLocalCacheAsync(FeatureCollection newOrUpdatedFeatures)
        {
            var localCacheRepository = _geoJsonCacheRepositories.FirstOrDefault(x => x.DataSourceType == DataSourceType.Local);

            if (localCacheRepository != null)
            {
                var geoJson = await localCacheRepository.GetAsync().ConfigureAwait(false);
                AddOrUpdateItems(newOrUpdatedFeatures, geoJson);
                await localCacheRepository.TryUpdateCacheAsync(geoJson).ConfigureAwait(false);
            }
            else
            {
                // Without a local repository, we're powerless
                _logger.LogWarning("No local cache available. Do not keep track of added or updated items.");
            }


            var osmCacheRepository = _geoJsonCacheRepositories.FirstOrDefault(x => x.DataSourceType == DataSourceType.Osm);
            if (osmCacheRepository != null)
            {
                var geoJson = await osmCacheRepository.GetAsync().ConfigureAwait(false);
                AddOrUpdateItems(newOrUpdatedFeatures, geoJson);
                await osmCacheRepository.TryUpdateCacheAsync(geoJson).ConfigureAwait(false);
            }
            else
            {
                // Without osm repository, we're powerless
                _logger.LogWarning("No osm cache available. Do not keep track of added or updated items.");
            }
        }

        private static void AddOrUpdateItems(FeatureCollection newOrUpdatedFeatures, FeatureCollection geoJson)
        {
            foreach (var newFeature in newOrUpdatedFeatures.Features)
            {
                var existingFeatureIndex = geoJson.Features.FindIndex(feature => feature.Id == newFeature.Id);

                if (existingFeatureIndex != -1)
                {
                    // Replace the existing feature
                    geoJson.Features[existingFeatureIndex] = newFeature;
                }
                else
                {
                    // Add the new feature
                    geoJson.Features.Add(newFeature);
                }
            }
        }
    }
}
