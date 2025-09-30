using Microsoft.AspNetCore.Mvc;

namespace DefikarteBackend.Model
{
    public class GeoJsonContentResult : ContentResult
    {
        private const string _contentType = "application/json";

        public GeoJsonContentResult(string content, int statusCode)
        {
            Content = content;
            StatusCode = statusCode;
            ContentType = _contentType;
        }

        public GeoJsonContentResult(string content) : this(content, 200)
        {
        }
    }
}
