using Newtonsoft.Json;

namespace DefikarteBackend.Model
{
    public class FeatureCollection
    {
        public string Type { get; set; } = "FeatureCollection";

        public List<Feature> Features { get; set; } = [];
    }

    public class FeatureCollection<TFeature>
    {
        public string Type { get; set; } = "FeatureCollection";

        public List<TFeature> Features { get; set; } = [];
    }

    public class Feature
    {
        public string Type { get; set; } = "Feature";

        public string Id { get; set; } = string.Empty;

        [JsonProperty("bbox")]
        public double[]? BBox { get; set; }

        public PointGeometry Geometry { get; set; } = new PointGeometry();

        public virtual Dictionary<string, string> Properties { get; set; } = [];
    }

    public class PointGeometry
    {
        public string Type { get; set; } = "Point";

        public double[] Coordinates { get; set; } = [];
    }
}