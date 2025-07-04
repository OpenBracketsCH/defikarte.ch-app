using DefikarteBackend.Model;
using OsmSharp;

namespace DefikarteBackend.Helpers
{
    public static class GeoJsonConverter
    {
        public static FeatureCollection Convert2GeoJson(IList<OsmNode> nodes)
        {
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

        public static FeatureCollection Convert2GeoJson(Node node)
        {
            var properties = node.Tags.ToDictionary(x => x.Key, x => x.Value);
            properties.Add("changesetId", node.ChangeSetId?.ToString() ?? string.Empty);
            properties.Add("timestamp", node.TimeStamp?.ToString("u") ?? string.Empty);
            properties.Add("version", node.Version?.ToString() ?? string.Empty);
            properties.Add("userId", node.UserId?.ToString() ?? string.Empty);
            properties.Add("userName", node.UserName?.ToString() ?? string.Empty);

            var featureCollection = new FeatureCollection
            {
                Type = "FeatureCollection",
                Features = [new Feature
                {
                    Id = node.Id?.ToString() ?? string.Empty,
                    Type = "Feature",
                    Geometry = new PointGeometry
                    {
                        Type = "Point",
                        Coordinates = [node.Longitude ?? 0, node.Latitude ?? 0],
                    },
                    Properties = properties,
                }],
            };

            return featureCollection;
        }
    }
}
