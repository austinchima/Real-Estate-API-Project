using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using AutoMapper;
using RealEstateAPI.Services;
using RealEstateAPI.DTOs;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for Realtor CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RealtorsController : ControllerBase
    {
        private readonly IRealtorService _realtorService;
        private readonly IMapper _mapper;

        /// <summary>Constructor with dependency injection</summary>
        public RealtorsController(IRealtorService realtorService, IMapper mapper)
        {
            _realtorService = realtorService;
            _mapper = mapper;
        }

        /// <summary>Gets all realtors</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RealtorReadDto>>> GetAllRealtorsAsync()
        {
            var realtors = await _realtorService.GetAllRealtorsAsync();
            var realtorDtos = _mapper.Map<IEnumerable<RealtorReadDto>>(realtors);
            return Ok(realtorDtos);
        }

        /// <summary>Gets realtor by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RealtorReadDto>> GetRealtorByIdAsync(int id)
        {
            var realtor = await _realtorService.GetRealtorByIdAsync(id);
            if (realtor == null)
                return NotFound();
            
            var realtorDto = _mapper.Map<RealtorReadDto>(realtor);
            return Ok(realtorDto);
        }

        /// <summary>Creates new realtor</summary>
        [HttpPost]
        public async Task<ActionResult<RealtorReadDto>> CreateRealtorAsync(RealtorCreateDto realtorCreateDto)
        {
            var realtor = _mapper.Map<RealEstateAPI.Models.Realtor>(realtorCreateDto);
            var created = await _realtorService.CreateRealtorAsync(realtor);
            var createdDto = _mapper.Map<RealtorReadDto>(created);
            return CreatedAtAction(nameof(GetRealtorByIdAsync), new { id = created.Id }, createdDto);
        }

        /// <summary>Updates entire realtor</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RealtorReadDto>> UpdateRealtorAsync(int id, RealtorUpdateDto realtorUpdateDto)
        {
            try
            {
                var realtor = _mapper.Map<RealEstateAPI.Models.Realtor>(realtorUpdateDto);
                var updated = await _realtorService.UpdateRealtorAsync(id, realtor);
                var updatedDto = _mapper.Map<RealtorReadDto>(updated);
                return Ok(updatedDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>Partially updates realtor</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<RealtorReadDto>> PatchRealtorAsync(int id, JsonPatchDocument<RealtorUpdateDto> patchDoc)
        {
            var realtor = await _realtorService.GetRealtorByIdAsync(id);
            if (realtor == null)
                return NotFound();

            var realtorToPatch = _mapper.Map<RealtorUpdateDto>(realtor);
            patchDoc.ApplyTo(realtorToPatch, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _mapper.Map(realtorToPatch, realtor);
            var updated = await _realtorService.UpdateRealtorAsync(id, realtor);
            var updatedDto = _mapper.Map<RealtorReadDto>(updated);
            return Ok(updatedDto);
        }

        /// <summary>Deletes realtor</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRealtorAsync(int id)
        {
            var deleted = await _realtorService.DeleteRealtorAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}