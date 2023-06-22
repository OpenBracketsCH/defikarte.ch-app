using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace DefikarteBackend.Model
{
    public class OsmNode : TableEntity
    {
        public OsmNode()
        {
            PartitionKey = "id";
            RowKey = Guid.NewGuid().ToString();
        }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("lat")]
        public double Lat { get; set; }

        [JsonProperty("lon")]
        public double Lon { get; set; }

        [JsonProperty("tags")]
        public Dictionary<string, string> Tags { get; set; }

        [JsonProperty("ttl")]
        public int TimeToLife { get; set; }
    }
}