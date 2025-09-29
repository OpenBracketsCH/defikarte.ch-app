using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DefikarteBackend.Model
{
    public class GeoJsonContentResult : ContentResult
    {
        private const string _contentType = "application/geo+json";

        public GeoJsonContentResult(string content, int statusCode)
        {
            Content = content;
            StatusCode = statusCode;
            ContentType = _contentType;
        }

        public GeoJsonContentResult(string content) : this(content, 200)
        {
        }

        public GeoJsonContentResult(object obj) : this(obj, 200)
        {
        }

        public GeoJsonContentResult(object obj, int statusCode)
        {
            Content = JsonConvert.SerializeObject(obj, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                }
            });
            StatusCode = statusCode;
            ContentType = _contentType;
        }
    }
}
