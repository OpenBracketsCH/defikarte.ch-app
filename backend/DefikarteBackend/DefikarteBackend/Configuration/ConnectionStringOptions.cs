using System;
using System.Data.Common;

namespace DefikarteBackend.Configuration
{
    public class ConnectionStringOptions
    {
        public Uri ServiceEndpoint { get; set; }

        public string AuthKey { get; set; }

        public static ConnectionStringOptions Create(string connectionString)
        {
            var builder = new DbConnectionStringBuilder()
            {
                ConnectionString = connectionString,
            };

            var options = new ConnectionStringOptions();

            if (builder.TryGetValue("AccountEndpoint", out object uri))
            {
                options.ServiceEndpoint = new Uri(uri.ToString());
            }

            if (builder.TryGetValue("AccountKey", out object key))
            {
                options.AuthKey = key.ToString();
            }

            return options;
        }

        public void Deconstruct(out Uri serviceEndpoint, out string authKey)
        {
            serviceEndpoint = ServiceEndpoint;
            authKey = AuthKey;
        }
    }
}