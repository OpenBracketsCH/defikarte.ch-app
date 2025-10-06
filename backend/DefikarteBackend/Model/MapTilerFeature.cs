using Newtonsoft.Json;

namespace DefikarteBackend.Model
{
    public class MapTilerFeature : Feature
    {
        [JsonProperty("place_name")]
        public string PlaceName { get; set; } = string.Empty;

        [JsonProperty("text")]
        public string Text { get; set; } = string.Empty;

        [JsonIgnore]
        public override Dictionary<string, string> Properties { get; set; } = [];

        [JsonProperty("properties")]
        public Dictionary<string, object> MaptilerProperties { get; set; } = [];

    }
}
