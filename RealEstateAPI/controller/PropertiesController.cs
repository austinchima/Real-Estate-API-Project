using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyRepository _propertyRepository;

        public PropertiesController(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
        {
            return await _propertyRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Property?> GetPropertyByIdAsync(int id)
        {
            return await _propertyRepository.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Property> CreatePropertyAsync(Property property)
        {
            return await _propertyRepository.CreateAsync(property);
        }

        [HttpPut("{id}")]
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

        [HttpDelete("{id}")]
        public async Task<bool> DeletePropertyAsync(int id)
        {
            return await _propertyRepository.DeleteAsync(id);
        }
    }
}