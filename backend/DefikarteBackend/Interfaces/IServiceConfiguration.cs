﻿namespace DefikarteBackend.Interfaces
{
    public interface IServiceConfiguration
    {
        string BlobStoragaConnectionString { get; }

        string BlobStorageBlobName { get; }

        string BlobStorageBlobNameV2 { get; }

        string BlobStorageContainerName { get; }

        string BlobStorageSwissBoundariesName { get; }

        string OsmApiToken { get; }

        string OsmApiUrl { get; }

        string OsmUserName { get; }

        string OverpassApiUrl { get; }
    }
}