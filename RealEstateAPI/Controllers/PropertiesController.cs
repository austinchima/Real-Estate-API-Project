using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for Property CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyRepository _propertyRepository;

        /// <summary>Constructor with dependency injection</summary>
        public PropertiesController(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        /// <summary>Gets all properties</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetAllPropertiesAsync()
        {
            var properties = await _propertyRepository.GetAllAsync();
            return Ok(properties);
        }

        /// <summary>Gets property by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetPropertyByIdAsync(int id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
                return NotFound();
            return Ok(property);
        }

        /// <summary>Creates new property</summary>
        [HttpPost]
        public async Task<ActionResult<Property>> CreatePropertyAsync(Property property)
        {
            var created = await _propertyRepository.CreateAsync(property);
            return CreatedAtAction(nameof(GetPropertyByIdAsync), new { id = created.Id }, created);
        }

        /// <summary>Updates entire property</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<Property>> UpdatePropertyAsync(int id, Property property)
        {
            var exists = await _propertyRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            property.Id = id;
            var updated = await _propertyRepository.UpdateAsync(property);
            return Ok(updated);
        }

        /// <summary>Partially updates property</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<Property>> PatchPropertyAsync(int id, Property property)
        {
            var exists = await _propertyRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            property.Id = id;
            var updated = await _propertyRepository.UpdateAsync(property);
            return Ok(updated);
        }

        /// <summary>Deletes property</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePropertyAsync(int id)
        {
            var deleted = await _propertyRepository.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}