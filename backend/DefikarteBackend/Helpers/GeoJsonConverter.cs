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

        public static FeatureCollection Convert2GeoJson(IList<Node> nodes)
        {
            var featureCollection = new FeatureCollection();
            foreach (var node in nodes)
            {
                var properties = node.Tags.ToDictionary(x => x.Key, x => x.Value);
                properties.Add("changesetId", node.ChangeSetId?.ToString() ?? string.Empty);
                properties.Add("timestamp", node.TimeStamp?.ToString("u") ?? string.Empty);
                properties.Add("version", node.Version?.ToString() ?? string.Empty);
                properties.Add("userId", node.UserId?.ToString() ?? string.Empty);
                properties.Add("userName", node.UserName?.ToString() ?? string.Empty);

                featureCollection.Features.Add(new Feature
                {
                    Id = node.Id?.ToString() ?? string.Empty,
                    Type = "Feature",
                    Geometry = new PointGeometry
                    {
                        Type = "Point",
                        Coordinates = [node.Longitude ?? 0, node.Latitude ?? 0],
                    },
                    Properties = properties,
                });
            }

            return featureCollection;
        }

        public static AedPropertyData Convert2AedPropertyData(Dictionary<string, string> sourceProps)
        {
            var props = new Dictionary<string, string>(sourceProps, StringComparer.OrdinalIgnoreCase);
            return new AedPropertyData
            {
                Reporter = props.TryGetValue("Reporter", out var reporter) ? reporter : null,
                Location = props.TryGetValue("defibrillator:location", out var location) ? location : null,
                Description = props.TryGetValue("Description", out var description) ? description : null,
                OperatorPhone = props.TryGetValue("phone", out var operatorPhone) ? operatorPhone : null,
                Access = props.TryGetValue("Access", out var access) ? access : null,
                Indoor = props.TryGetValue("Indoor", out var indoor) ? indoor : null,
                Level = props.TryGetValue("Level", out var level) ? level : null,
                Operator = props.TryGetValue("Operator", out var op) ? op : null,
                Source = props.TryGetValue("Source", out var source) ? source : null,
                OpeningHours = props.TryGetValue("opening_hours", out var openingHours) ? openingHours : null,
            };
        }
    }
}
