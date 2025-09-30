using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;

namespace DefikarteBackend.Configuration
{
    public class CustomOpenApiConfigurationOptions : DefaultOpenApiConfigurationOptions
    {
        public override OpenApiInfo Info { get; set; } = new OpenApiInfo()
        {
            Version = "1.0.0",
            Title = "OpenAPI Document for defikarte.ch API",
            Description = "HTTP/s APIs used for the defikarte.ch",
            TermsOfService = new Uri("https://defikarte.ch/privacy"),
            Contact = new OpenApiContact()
            {
                Name = "defikarte.ch API",
                Email = "info@defikarte.ch",
                Url = new Uri("https://github.com/OpenBracketsCH/defikarte.ch-app/issues"),
            },
        };

        public override OpenApiVersionType OpenApiVersion { get; set; } = OpenApiVersionType.V3;
    }
}