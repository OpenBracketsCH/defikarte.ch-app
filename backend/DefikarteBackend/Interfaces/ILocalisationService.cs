using System.Threading.Tasks;

namespace DefikarteBackend.Interfaces
{
    public interface ILocalisationService
    {
        Task<bool> IsSwitzerlandAsync(double latitude, double longitude);
    }
}