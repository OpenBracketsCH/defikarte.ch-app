using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;

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
            var connectionStringOptions = ConnectionStringOptions.Create(configuration.GetConnectionStringOrSetting("COSMOS_DBCONNECTION"));
            IDocumentClient documentClient = new DocumentClient(connectionStringOptions.ServiceEndpoint, connectionStringOptions.AuthKey);
            
            builder.Services.AddSingleton((s) =>  serivceConfig);
            builder.Services.AddSingleton<IDocumentClient>(s => documentClient);
            builder.Services.AddTransient<ICacheRepository, OsmAedCacheRepository>();
        }

        private IConfigurationRoot LoadConfiguration()
        {
            return new ConfigurationBuilder()
                   .AddEnvironmentVariables() // access (production) environment variables
                   .Build();
        }
    }
}
