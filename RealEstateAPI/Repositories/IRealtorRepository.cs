using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository interface for Realtor entity with additional query methods
/// </summary>
public interface IRealtorRepository : IRepository<Realtor>
{
    /// <summary>
    /// Retrieves realtors by agency name asynchronously
    /// </summary>
    /// <param name="agency">Agency name</param>
    /// <returns>Collection of realtors from the agency</returns>
    Task<IEnumerable<Realtor>> GetByAgencyAsync(string agency);

    /// <summary>
    /// Retrieves a realtor with their associated properties asynchronously
    /// </summary>
    /// <param name="id">Realtor ID</param>
    /// <returns>Realtor with properties if found, null otherwise</returns>
    Task<Realtor?> GetWithPropertiesAsync(int id);
}
