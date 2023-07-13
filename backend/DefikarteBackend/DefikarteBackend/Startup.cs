using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.Model;
using Azure.Storage.Blobs;

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

            builder.Services.AddSingleton((s) => serviceConfig);
            builder.Services.AddTransient<ICacheRepository<OsmNode>>(s =>
                new BlobStorageCacheRepository(container, serviceConfig.BlobStorageBlobName));
        }

        private IConfigurationRoot LoadConfiguration()
        {
            return new ConfigurationBuilder()
                   .AddEnvironmentVariables() // access (production) environment variables
                   .Build();
        }
    }
}