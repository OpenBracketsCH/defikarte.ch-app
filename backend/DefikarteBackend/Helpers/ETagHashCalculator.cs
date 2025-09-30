using System.IO.Hashing;
using System.Text;

namespace DefikarteBackend.Helpers
{
    public static class ETagHashCalculator
    {
        public static string Calculate(string content)
        {
            byte[] hashBytes = XxHash64.Hash(Encoding.UTF8.GetBytes(content));
            return $"\"{Convert.ToBase64String(hashBytes)}\"";
        }
    }
}
