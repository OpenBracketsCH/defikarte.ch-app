using System.Security.Cryptography;
using System.Text;

namespace DefikarteBackend.Helpers
{
    public static class ETagHashCalculator
    {
        public static string Calculate(string content)
        {
            byte[] hashBytes = MD5.HashData(Encoding.UTF8.GetBytes(content));
            return $"\"{Convert.ToBase64String(hashBytes)}\"";
        }
    }
}
