using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.Model;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using System;

[assembly: FunctionsStartup(typeof(DefikarteBackend.Startup))]
namespace DefikarteBackend
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var configuration = LoadConfiguration();
            var serivceConfig = ServiceConfiguration.Initialize(configuration);

            // Basic database settings & setup
            var connectionStringOptions = ConnectionStringOptions.Create(serivceConfig.CosmosDBConnectionString);
            IDocumentClient documentClient = new DocumentClient(connectionStringOptions.ServiceEndpoint, connectionStringOptions.AuthKey);

            CloudTableClient tableClient = CloudStorageAccount.Parse(serivceConfig.TableStoragaConnectionString).CreateCloudTableClient();
            CloudTable table = tableClient.GetTableReference("deficache");

            builder.Services.AddSingleton((s) => serivceConfig);
            builder.Services.AddSingleton<IDocumentClient>(s => documentClient);
            builder.Services.AddSingleton<CloudTable>(s => table);


            //builder.Services.AddTransient<ICacheRepository<OsmNode>, CosmosDbCacheRepository>();
            builder.Services.AddTransient<ICacheRepository<OsmNode>, TableStorageCacheRepository<OsmNode>>();
        }

        private IConfigurationRoot LoadConfiguration()
        {
            return new ConfigurationBuilder()
                   .AddEnvironmentVariables() // access (production) environment variables
                   .Build();
        }
    }
}
