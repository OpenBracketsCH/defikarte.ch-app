using Microsoft.Extensions.Configuration;

namespace DefikarteBackend.Configuration
{
    public class ServiceConfiguration
    {
        public string OsmApiUrl { get; set; }

        public string OsmUserName { get; set; }

        public string OsmUserPassword { get; set; }

        public string OverpassApiUrl { get; set; }

        public string TableStorageTableName { get; set; }

        public string TableStoragaConnectionString { get; set; }

        public string BlobStorageContainerName { get; set; }

        public string BlobStorageBlobName { get; set; }

        public string BlobStoragaConnectionString { get; set; }

        public static ServiceConfiguration Initialize(IConfigurationRoot configuration)
        {
            return new ServiceConfiguration
            {
                OsmApiUrl = configuration.GetConnectionStringOrSetting("OSM_API_URL"),
                OsmUserName = configuration.GetConnectionStringOrSetting("OSM_USER_NAME"),
                OsmUserPassword = configuration.GetConnectionStringOrSetting("OSM_USER_PASSWORD"),
                OverpassApiUrl = configuration.GetConnectionStringOrSetting("OVERPASS_URL"),
                TableStoragaConnectionString = configuration.GetConnectionStringOrSetting("AzureWebJobsStorage"),
                TableStorageTableName = configuration.GetConnectionStringOrSetting("TABLE_STORAGE_TABLE_NAME"),
                BlobStoragaConnectionString = configuration.GetConnectionStringOrSetting("AzureWebJobsStorage"),
                BlobStorageContainerName = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_CONTAINER_NAME"),
                BlobStorageBlobName = configuration.GetConnectionStringOrSetting("BLOB_STORAGE_BLOB_NAME"),
            };
        }
    }
}