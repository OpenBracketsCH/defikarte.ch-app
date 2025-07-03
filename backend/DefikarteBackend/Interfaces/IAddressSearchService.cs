using DefikarteBackend.Model;

namespace DefikarteBackend.Interfaces
{
    public interface IAddressSearchService
    {
        Task<FeatureCollection?> SearchAddressAsync(string searchText);
    }
}