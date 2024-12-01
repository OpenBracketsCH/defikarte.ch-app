using DefikarteBackend.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DefikarteBackend.Configuration
{
    public class ServiceConfiguration : IServiceConfiguration
    {
        public string OsmApiUrl { get; private set; }

        public string OsmUserName { get; private set; }

        public string OsmApiToken { get; private set; }

        public string OverpassApiUrl { get; private set; }

        public string BlobStorageContainerName { get; private set; }

        public string BlobStorageBlobName { get; private set; }

        public string BlobStorageBlobNameV2 { get; private set; }

        public string BlobStoragaConnectionString { get; private set; }

        public string BlobStorageSwissBoundariesName { get; private set; }

        public static ServiceConfiguration Initialize(IConfigurationRoot configuration)
        {
            return new ServiceConfiguration
            {
                OsmApiUrl = configuration.GetConnectionStringOrSetting("OSM_API_URL"),
                OsmUserName = configuration.GetConnectionStringOrSetting("OSM_USER_NAME"),
                OsmApiToken = configuration.GetConnectionStringOrSetting("OSM_API_TOKEN"),
                OverpassApiUrl = configuration.GetConnectionStringOrSetting("OVERPASS_URL"),
                BlobStoragaConnectionString = configuration.GetConnectionStringOrSetting("AzureWebJobsStorage"),
                BlobStorageContainerName = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_CONTAINER_NAME"),
                BlobStorageBlobName = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_BLOB_NAME"),
                BlobStorageBlobNameV2 = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_BLOB_NAME_V2"),
                BlobStorageSwissBoundariesName = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_SWISSBOUNDARIES"),
            };
        }
    }
}