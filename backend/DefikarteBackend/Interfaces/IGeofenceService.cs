using System.Threading.Tasks;

namespace DefikarteBackend.Interfaces
{
    public interface IGeofenceService
    {
        Task<bool> IsSwitzerlandAsync(double latitude, double longitude);
    }
}