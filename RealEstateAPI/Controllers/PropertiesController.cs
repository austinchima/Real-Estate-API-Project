using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.controller
{
    /// <summary>
    /// API Controller for Property CRUD operations
    /// </summary>
    /// <summary>
    /// API Controller for Property CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyRepository _propertyRepository;

        /// <summary> Constructor with dependency injection </summary>
        /// <param name="propertyRepository"></param>
        public PropertiesController(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        /// <summary>Gets all properties</summary>
        [HttpGet]
        public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
        {
            return await _propertyRepository.GetAllAsync();
        }

        /// <summary>Gets property by ID</summary>
        [HttpGet("{id}")]
        public async Task<Property?> GetPropertyByIdAsync(int id)
        {
            return await _propertyRepository.GetByIdAsync(id);
        }

        /// <summary>Creates new property</summary>
        [HttpPost]
        public async Task<Property> CreatePropertyAsync(Property property)
        {
            return await _propertyRepository.CreateAsync(property);
        }

        /// <summary>Updates property</summary>
        [HttpPatch("{id}")]
        public async Task<Property> UpdateAsyncPropertyAsync(int id, Property property)
        {
            var exists = await _propertyRepository.ExistsAsync(id);
            if (!exists)
            {
                throw new KeyNotFoundException("Property not found");
            }
            
            property.Id = id;
            return await _propertyRepository.UpdateAsync(property);
        }

        /// <summary>Deletes property</summary>
        [HttpDelete("{id}")]
        public async Task<bool> DeletePropertyAsync(int id)
        {
            return await _propertyRepository.DeleteAsync(id);
        }
    }
}