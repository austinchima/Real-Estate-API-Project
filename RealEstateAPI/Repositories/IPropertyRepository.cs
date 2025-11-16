using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository interface for Property entity with additional query methods
/// </summary>
public interface IPropertyRepository : IRepository<Property>
{
    /// <summary>
    /// Retrieves properties by property type asynchronously
    /// </summary>
    /// <param name="propertyType">Type of property (House, Condo, Apartment, etc.)</param>
    /// <returns>Collection of properties matching the type</returns>
    Task<IEnumerable<Property>> GetByPropertyTypeAsync(string propertyType);

    /// <summary>
    /// Retrieves properties by realtor ID asynchronously
    /// </summary>
    /// <param name="realtorId">Realtor ID</param>
    /// <returns>Collection of properties managed by the realtor</returns>
    Task<IEnumerable<Property>> GetByRealtorIdAsync(int realtorId);
}
