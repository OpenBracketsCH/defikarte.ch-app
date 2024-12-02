using Azure.Storage.Blobs;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.Repository;
using DefikarteBackend.Services;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Implementation;

[assembly: FunctionsStartup(typeof(DefikarteBackend.Startup))]
namespace DefikarteBackend
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var configuration = LoadConfiguration();
            var serviceConfig = ServiceConfiguration.Initialize(configuration);

            var container = new BlobContainerClient(serviceConfig.BlobStoragaConnectionString, serviceConfig.BlobStorageContainerName);
            container.CreateIfNotExists();

            builder.Services.AddSingleton<IServiceConfiguration>((s) => serviceConfig);
            builder.Services.AddTransient<ICacheRepository<OsmNode>>(s =>
                new BlobStorageCacheRepository(container, serviceConfig.BlobStorageBlobName));
            builder.Services.AddTransient<IGeoJsonCacheRepository>(s =>
                new BlobStorageCacheRepositoryV2(container, serviceConfig.BlobStorageBlobNameV2));

            builder.Services.AddSingleton<BlobContainerClient>(container);
            builder.Services.AddSingleton<IBlobStorageDataRepository, BlobStorageDataRepository>();

            builder.Services.AddSingleton<IOpenApiConfigurationOptions>(s => new CustomOpenApiConfigurationOptions());

            builder.Services.AddSingleton<ILocalisationService, LocalisationService>();
            RegisterNtsGeometryServices(builder.Services);
        }

        private IConfigurationRoot LoadConfiguration()
        {
            return new ConfigurationBuilder()
                   .AddEnvironmentVariables() // access (production) environment variables
                   .Build();
        }

        private void RegisterNtsGeometryServices(IServiceCollection services)
        {
            NtsGeometryServices.Instance = new NtsGeometryServices(
                CoordinateArraySequenceFactory.Instance,
                new PrecisionModel(1000d),
                4326,
                GeometryOverlay.NG,
                new CoordinateEqualityComparer());

            services.AddSingleton(NtsGeometryServices.Instance);
        }
    }
}