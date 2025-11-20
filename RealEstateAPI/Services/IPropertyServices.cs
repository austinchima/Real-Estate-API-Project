using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.Services
{
    public interface IPropertyService
    {
        Task<IEnumerable<Property>> GetAllPropertiesAsync();
        Task<Property?> GetPropertyByIdAsync(int id);
        Task<Property> CreatePropertyAsync(Property property);
        Task<Property> UpdatePropertyAsync(int id, Property property);
        Task<bool> DeletePropertyAsync(int id);
        Task<IEnumerable<Property>> GetPropertiesByTypeAsync(string propertyType);
        Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId);
    }

    /// <summary>
    /// Business logic layer for Property operations
    /// </summary>
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;

        public PropertyService(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
        {
            return await _propertyRepository.GetAllAsync();
        }

        public async Task<Property?> GetPropertyByIdAsync(int id)
        {
            return await _propertyRepository.GetByIdAsync(id);
        }

        public async Task<Property> CreatePropertyAsync(Property property)
        {
            property.ListedDate = DateTime.UtcNow;
            if (string.IsNullOrEmpty(property.Status))
                property.Status = "Available";
            
            return await _propertyRepository.CreateAsync(property);
        }

        public async Task<Property> UpdatePropertyAsync(int id, Property property)
        {
            var exists = await _propertyRepository.ExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException("Property not found");
            
            property.Id = id;
            return await _propertyRepository.UpdateAsync(property);
        }

        public async Task<bool> DeletePropertyAsync(int id)
        {
            return await _propertyRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Property>> GetPropertiesByTypeAsync(string propertyType)
        {
            return await _propertyRepository.GetByPropertyTypeAsync(propertyType);
        }

        public async Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId)
        {
            return await _propertyRepository.GetByRealtorIdAsync(realtorId);
        }
    }
}
