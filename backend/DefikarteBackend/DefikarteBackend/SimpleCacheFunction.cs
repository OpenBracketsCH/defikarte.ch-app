using System;
using System.Threading.Tasks;
using DefikarteBackend.Cache;
using DefikarteBackend.OsmOverpassApi;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class SimpleCacheFunction
    {
        private readonly IConfigurationRoot config;

        public SimpleCacheFunction(IConfigurationRoot config)
        {
            this.config = config;
        }

        [FunctionName("SimpleCacheFunction")]
        public async Task RunAsync([TimerTrigger("0 */1 * * * *")] TimerInfo myTimer, [DurableClient(TaskHub = "%BackendTaskHub%")] IDurableEntityClient client, ILogger log)
        {
            var overpassApiUrl = this.config["overpassUrl"];
            var overpassApiClient = new OverpassClient(overpassApiUrl);

            try
            {
                var response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                await client.SignalEntityAsync<ISimpleCache>(new EntityId(nameof(SimpleCache), "cache"), cache => cache.TryUpdateCache(response));
                EntityStateResponse<SimpleCache> stateResponse = await client.ReadEntityStateAsync<SimpleCache>(new EntityId(nameof(SimpleCache), "cache"));
                log.LogInformation($"Updated cache({stateResponse.EntityState?.CacheId}). LastUpdate:{stateResponse.EntityState?.LastUpdate}");
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }
        }
    }
}
