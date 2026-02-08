namespace DefikarteBackend.Interfaces
{
    public interface IServiceConfiguration
    {
        string BlobStorageConnectionString { get; }

        string BlobStorageBlobName { get; }

        string BlobStorageBlobNameV2 { get; }

        string BlobStorageBlobNameLocalV2 { get; }

        string BlobStorageContainerName { get; }

        string BlobStorageSwissBoundariesName { get; }

        string OsmApiToken { get; }

        string OsmApiUrl { get; }

        string OsmUserName { get; }

        string OverpassApiUrl { get; }

        string AddressSearchUrl { get; }

        string MaptilerApiKey { get; }
    }
}