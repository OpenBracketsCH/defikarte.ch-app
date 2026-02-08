using DefikarteBackend.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DefikarteBackend.Configuration
{
    public class ServiceConfiguration : IServiceConfiguration
    {
        public string OsmApiUrl { get; private set; } = string.Empty;

        public string OsmUserName { get; private set; } = string.Empty;

        public string OsmApiToken { get; private set; } = string.Empty;

        public string OverpassApiUrl { get; private set; } = string.Empty;

        public string BlobStorageContainerName { get; private set; } = string.Empty;

        public string BlobStorageBlobName { get; private set; } = string.Empty;

        public string BlobStorageBlobNameV2 { get; private set; } = string.Empty;

        public string BlobStorageBlobNameLocalV2 { get; private set; } = string.Empty;

        public string BlobStorageConnectionString { get; private set; } = string.Empty;

        public string BlobStorageSwissBoundariesName { get; private set; } = string.Empty;

        public string AddressSearchUrl { get; private set; } = string.Empty;

        public string MaptilerApiKey { get; private set; } = string.Empty;

        public static ServiceConfiguration Initialize(IConfigurationRoot configuration)
        {
            return new ServiceConfiguration
            {
                OsmApiUrl = configuration.GetValue<string>("OSM_API_URL") ?? string.Empty,
                OsmUserName = configuration.GetValue<string>("OSM_USER_NAME") ?? string.Empty,
                OsmApiToken = configuration.GetValue<string>("OSM_API_TOKEN") ?? string.Empty,
                OverpassApiUrl = configuration.GetValue<string>("OVERPASS_URL") ?? string.Empty,
                BlobStorageConnectionString = configuration.GetValue<string>("AzureWebJobsStorage") ?? string.Empty,
                BlobStorageContainerName = configuration.GetValue<string>("BLOB_STORAGE_CONTAINER_NAME") ?? string.Empty,
                BlobStorageBlobName = configuration.GetValue<string>("BLOB_STORAGE_BLOB_NAME") ?? string.Empty,
                BlobStorageBlobNameV2 = configuration.GetValue<string>("BLOB_STORAGE_BLOB_NAME_V2") ?? string.Empty,
                BlobStorageBlobNameLocalV2 = configuration.GetValue<string>("BLOB_STORAGE_BLOB_NAME_LOCAL_V2") ?? string.Empty,
                BlobStorageSwissBoundariesName = configuration.GetValue<string>("BLOB_STORAGE_SWISSBOUNDARIES") ?? string.Empty,
                AddressSearchUrl = configuration.GetValue<string>("ADDRESS_SEARCH_URL") ?? string.Empty,
                MaptilerApiKey = configuration.GetValue<string>("MAPTILER_API_KEY") ?? string.Empty,
            };
        }
    }
}