using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DefikarteBackend.Model
{
    public class SwisstopoFeature : Feature
    {
        [JsonIgnore]
        public override Dictionary<string, string> Properties { get; set; } = [];

        [JsonProperty("properties")]
        public Dictionary<string, JToken> SwisstopoProperties { get; set; } = [];
    }
}
