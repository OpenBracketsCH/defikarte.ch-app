using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(DefikarteBackend.Startup))]
namespace DefikarteBackend
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton((s) => { return LoadConfiguration(); });
        }

        private IConfigurationRoot LoadConfiguration()
        {
            return new ConfigurationBuilder()
                   .AddEnvironmentVariables() // access (production) environment variables
                   .Build();
        }
    }
}
