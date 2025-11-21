using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using AutoMapper;
using RealEstateAPI.Services;
using RealEstateAPI.DTOs;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for Property CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly IMapper _mapper;

        /// <summary>Constructor with dependency injection</summary>
        public PropertiesController(IPropertyService propertyService, IMapper mapper)
        {
            _propertyService = propertyService;
            _mapper = mapper;
        }

        /// <summary>Gets all properties</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyReadDto>>> GetAllPropertiesAsync()
        {
            var properties = await _propertyService.GetAllPropertiesAsync();
            var propertyDtos = _mapper.Map<IEnumerable<PropertyReadDto>>(properties);
            return Ok(propertyDtos);
        }

        /// <summary>Gets property by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyReadDto>> GetPropertyByIdAsync(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null)
                return NotFound();
            
            var propertyDto = _mapper.Map<PropertyReadDto>(property);
            return Ok(propertyDto);
        }

        /// <summary>Creates new property</summary>
        [HttpPost]
        public async Task<ActionResult<PropertyReadDto>> CreatePropertyAsync(PropertyCreateDto propertyCreateDto)
        {
            var property = _mapper.Map<RealEstateAPI.Models.Property>(propertyCreateDto);
            var created = await _propertyService.CreatePropertyAsync(property);
            var createdDto = _mapper.Map<PropertyReadDto>(created);
            return CreatedAtAction(nameof(GetPropertyByIdAsync), new { id = created.Id }, createdDto);
        }

        /// <summary>Updates entire property</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<PropertyReadDto>> UpdatePropertyAsync(int id, PropertyUpdateDto propertyUpdateDto)
        {
            try
            {
                var property = _mapper.Map<RealEstateAPI.Models.Property>(propertyUpdateDto);
                var updated = await _propertyService.UpdatePropertyAsync(id, property);
                var updatedDto = _mapper.Map<PropertyReadDto>(updated);
                return Ok(updatedDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>Partially updates property</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<PropertyReadDto>> PatchPropertyAsync(int id, JsonPatchDocument<PropertyUpdateDto> patchDoc)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null)
                return NotFound();

            var propertyToPatch = _mapper.Map<PropertyUpdateDto>(property);
            patchDoc.ApplyTo(propertyToPatch, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _mapper.Map(propertyToPatch, property);
            var updated = await _propertyService.UpdatePropertyAsync(id, property);
            var updatedDto = _mapper.Map<PropertyReadDto>(updated);
            return Ok(updatedDto);
        }

        /// <summary>Deletes property</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePropertyAsync(int id)
        {
            var deleted = await _propertyService.DeletePropertyAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}