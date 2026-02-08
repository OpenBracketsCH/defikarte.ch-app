using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DefikarteBackend.Services
{
    public class MaptilerAddressSearchService : IAddressSearchService
    {
        private static readonly HttpClient _httpClient = new();
        private readonly IServiceConfiguration _configuration;
        private readonly ILogger<MaptilerAddressSearchService> _logger;

        public MaptilerAddressSearchService(IServiceConfiguration configuration, ILogger<MaptilerAddressSearchService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<FeatureCollection?> SearchAddressAsync(string searchText)
        {
            var query = new Dictionary<string, string>
            {
                { "types", "region,municipality,municipal_district,locality,place,address,road,poi" },
                { "country", "ch" },
                { "limit", "10" },
                { "key",  _configuration.MaptilerApiKey }
            };

            try
            {
                var uriBuilder = new UriBuilder($"https://api.maptiler.com/geocoding/{searchText}.json")
                {
                    Query = await new FormUrlEncodedContent(query).ReadAsStringAsync().ConfigureAwait(false)
                };

                var url = uriBuilder.ToString();
                var response = await _httpClient.GetAsync(url).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var featureCollection = JsonConvert.DeserializeObject<FeatureCollection<MapTilerFeature>>(jsonString);
                    if (featureCollection == null)
                    {
                        return null;
                    }

                    // place_name examples
                    // poi: Medienpark, Flurstrasse 53, 8048 Zürich, Schweiz/Suisse/Svizzera/Svizra
                    // address: Flurstrasse 55, 8048 Zürich, Schweiz/Suisse/Svizzera/Svizra
                    foreach (var feature in featureCollection.Features)
                    {
                        if (!string.IsNullOrEmpty(feature.PlaceName))
                        {
                            var values = CleanPlaceNameContent(feature.PlaceName);
                            feature.MaptilerProperties["addressPrimary"] = values != null && values.Count > 0 ? values[0] : string.Empty;
                            feature.MaptilerProperties["addressSecondary"] = values != null && values.Count > 1 ? values[1] : string.Empty;
                        }
                    }

                    return ConvertToFeatureCollection(featureCollection);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching address.");
            }

            return new FeatureCollection { Type = "FeatureCollection", Features = [] };
        }

        private static List<string>? CleanPlaceNameContent(string placeName)
        {
            if (string.IsNullOrEmpty(placeName))
            {
                return null;
            }

            var parts = placeName
                .Split(",")
                .Select(part => part.Trim())
                .Where(part => !string.IsNullOrWhiteSpace(part) && !part.Contains("Schweiz/Suisse/Svizzera/Svizra"))
                .ToList();

            int index = parts.Count / 2;
            string firstPart = string.Join(", ", parts.Take(index));
            string secondPart = string.Join(", ", parts.Skip(index));
            return [firstPart, secondPart];
        }

        private static FeatureCollection ConvertToFeatureCollection(FeatureCollection<MapTilerFeature> source)
        {
            return new FeatureCollection
            {
                Features = source.Features.Select(f => (Feature)f).ToList(),
            };
        }
    }
}
