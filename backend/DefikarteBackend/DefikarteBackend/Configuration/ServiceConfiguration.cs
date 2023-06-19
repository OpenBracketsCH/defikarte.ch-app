using Microsoft.Extensions.Configuration;

namespace DefikarteBackend.Configuration
{
    public class ServiceConfiguration
    {
        public string OsmApiUrl { get; set; }

        public string OsmUserName { get; set; }

        public string OsmUserPassword { get; set; }

        public string OverpassApiUrl { get; set; }

        public string CosmosDBConnectionString { get; set; }

        public string DatabaseName { get; set; }

        public string CacheCollectionName { get; set; }

        public static ServiceConfiguration Initialize(IConfigurationRoot configuration)
        {
            return new ServiceConfiguration
            {
                OsmApiUrl = configuration.GetConnectionStringOrSetting("OSM_API_URL"),
                OsmUserName = configuration.GetConnectionStringOrSetting("OSM_USER_NAME"),
                OsmUserPassword = configuration.GetConnectionStringOrSetting("OSM_USER_PASSWORD"),
                OverpassApiUrl = configuration.GetConnectionStringOrSetting("OVERPASS_URL"),
                CosmosDBConnectionString = configuration.GetConnectionStringOrSetting("COSMOS_DBCONNECTION"),
                DatabaseName = configuration.GetConnectionStringOrSetting("COSMOS_DBNAME"),
                CacheCollectionName = configuration.GetConnectionStringOrSetting("COSMOS_CACHE_COLLECTION")
            };
        }
    }
}