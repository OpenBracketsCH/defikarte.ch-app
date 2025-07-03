using DefikarteBackend.Model;

namespace DefikarteBackend.Helpers
{
    public static class GeoJsonConverter
    {
        public static FeatureCollection Convert2GeoJson(IList<OsmNode> nodes)
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
