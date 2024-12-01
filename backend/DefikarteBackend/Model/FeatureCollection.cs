using System.Collections.Generic;

namespace DefikarteBackend.Model
{
    public class FeatureCollection
    {
        public string Type { get; set; } = "FeatureCollection";

        public List<Feature> Features { get; set; } = new List<Feature>();
    }

    public class Feature
    {
        public string Type { get; set; } = "Feature";

        public string Id { get; set; }

        public PointGeometry Geometry { get; set; }

        public Dictionary<string, string> Properties { get; set; }
    }

    public class PointGeometry
    {
        public string Type { get; set; } = "Point";

        public double[] Coordinates { get; set; }
    }
}