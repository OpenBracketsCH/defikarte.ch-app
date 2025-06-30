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
            Title = "OpenAPI Document for Defikarte.ch-API",
            Description = "HTTP APIs used for the Defikarte.ch",
            TermsOfService = new Uri("https://defikarte.ch/impressum.html"),
            Contact = new OpenApiContact()
            {
                Name = "Defikarte.ch-API",
                Email = "info@defikarte.ch",
                Url = new Uri("https://github.com/OpenBracketsCH/defikarte.ch-app/issues"),
            },
        };

        public override OpenApiVersionType OpenApiVersion { get; set; } = OpenApiVersionType.V3;
    }
}