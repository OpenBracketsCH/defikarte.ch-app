﻿using System.Threading.Tasks;

namespace DefikarteBackend.Interfaces
{
    public interface IBlobStorageDataRepository
    {
        Task CreateAsync(string jsonData, string blobName);
        Task<string> ReadAsync(string blobName);
    }
}