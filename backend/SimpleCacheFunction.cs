using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly IGeoJsonCacheRepository _geoJsonCacheRepository;

        public SimpleCacheFunction(
            ServiceConfiguration config,
            ICacheRepository<OsmNode> cacheRepository,
            IGeoJsonCacheRepository geoJsonCacheRepository)
        {
            _config = config;
            _cacheRepository = cacheRepository;
            _geoJsonCacheRepository = geoJsonCacheRepository;
        }

        [FunctionName("SimpleCacheFunction")]
        public async Task RunAsync([TimerTrigger("0 */15 * * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log)
        {
            var overpassApiUrl = _config.OverpassApiUrl;
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var cacheV1Task = _cacheRepository.TryUpdateCacheAsync(response);
                var cacheV2Task = _geoJsonCacheRepository.TryUpdateCacheAsync(Convert2GeoJson(response));

                var results = await Task.WhenAll(cacheV1Task, cacheV2Task);
                log.LogInformation($"Updated cache sucessful:{results.All(x => x)}");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }
        }

        private FeatureCollection Convert2GeoJson(IList<OsmNode> nodes)
        {
            // Convert to GeoJson
            var featureCollection = new FeatureCollection
            {
                Type = "FeatureCollection",
                Features = nodes.Select(n => new Feature
                {
                    Id = n.Id,
                    Type = "Feature",
                    Geometry = new PointGeometry
                    {
                        Type = "Point",
                        Coordinates = new double[] { n.Lon, n.Lat },
                    },
                    Properties = n.Tags,
                }).ToList(),
            };

            return featureCollection;
        }
    }
}