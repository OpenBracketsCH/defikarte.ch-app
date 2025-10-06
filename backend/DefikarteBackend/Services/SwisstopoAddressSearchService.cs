using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DefikarteBackend.Services
{
    public class SwisstopoAddressSearchService : IAddressSearchService
    {
        private static readonly string ICON_TAG = "<i>";
        private static readonly string ICON_TAG_END = "</i>";
        private static readonly string BOLD_TAG = "<b>";
        private static readonly string BOLD_TAG_END = "</b>";
        private static readonly HttpClient _httpClient = new();
        private static readonly List<string> TAG_LIST = [ICON_TAG, ICON_TAG_END, BOLD_TAG, BOLD_TAG_END];

        private readonly IServiceConfiguration _configuration;
        private readonly ILogger<SwisstopoAddressSearchService> _logger;

        public SwisstopoAddressSearchService(IServiceConfiguration configuration, ILogger<SwisstopoAddressSearchService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<FeatureCollection?> SearchAddressAsync(string searchText)
        {
            var query = new Dictionary<string, string>
            {
                { "searchText", searchText },
                { "type", "locations" },
                { "returnGeometry", "true" },
                { "limit", "15" },
                { "sr", "4326" },
                { "geometryFormat", "geojson" }
            };

            try
            {
                var uriBuilder = new UriBuilder(_configuration.AddressSearchUrl)
                {
                    Query = await new FormUrlEncodedContent(query).ReadAsStringAsync().ConfigureAwait(false)
                };

                var url = uriBuilder.ToString();
                var response = await _httpClient.GetAsync(url).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var featureCollection = JsonConvert.DeserializeObject<FeatureCollection>(jsonString);
                    if (featureCollection == null)
                    {
                        return null;
                    }

                    foreach (var feature in featureCollection.Features)
                    {
                        if (feature.Properties.TryGetValue("label", out var label) && !string.IsNullOrEmpty(label))
                        {
                            var values = CleanLabelContent(label);
                            feature.Properties["addressPrimary"] = values != null && values.Count > 0 ? values[0] : string.Empty;
                            feature.Properties["addressSecondary"] = values != null && values.Count > 1 ? values[1] : string.Empty;
                        }
                    }

                    return featureCollection;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching address.");
            }

            return new FeatureCollection { Type = "FeatureCollection", Features = [] };
        }

        private static List<string>? CleanLabelContent(string label)
        {
            if (string.IsNullOrEmpty(label))
            {
                return null;
            }

            var parts = System.Text.RegularExpressions.Regex
                .Split(label, @"(</?i>|</?b>)")
                .Select(part => part.Trim())
                .Where(part => !string.IsNullOrWhiteSpace(part))
                .ToList();

            var index = parts.LastIndexOf(ICON_TAG_END);
            return parts
                .Skip(index + 1)
                .Where(part => !TAG_LIST.Contains(part))
                .ToList();
        }
    }
}
