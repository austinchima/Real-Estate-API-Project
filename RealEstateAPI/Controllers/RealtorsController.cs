using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for Realtor CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RealtorsController : ControllerBase
    {
        private readonly IRealtorRepository _realtorRepository;

        /// <summary>Constructor with dependency injection</summary>
        public RealtorsController(IRealtorRepository realtorRepository)
        {
            _realtorRepository = realtorRepository;
        }

        /// <summary>Gets all realtors</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Realtor>>> GetAllRealtorsAsync()
        {
            var realtors = await _realtorRepository.GetAllAsync();
            return Ok(realtors);
        }

        /// <summary>Gets realtor by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Realtor>> GetRealtorByIdAsync(int id)
        {
            var realtor = await _realtorRepository.GetByIdAsync(id);
            if (realtor == null)
                return NotFound();
            return Ok(realtor);
        }

        /// <summary>Creates new realtor</summary>
        [HttpPost]
        public async Task<ActionResult<Realtor>> CreateRealtorAsync(Realtor realtor)
        {
            var created = await _realtorRepository.CreateAsync(realtor);
            return CreatedAtAction(nameof(GetRealtorByIdAsync), new { id = created.Id }, created);
        }

        /// <summary>Updates entire realtor</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<Realtor>> UpdateRealtorAsync(int id, Realtor realtor)
        {
            var exists = await _realtorRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            realtor.Id = id;
            var updated = await _realtorRepository.UpdateAsync(realtor);
            return Ok(updated);
        }

        /// <summary>Partially updates realtor</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<Realtor>> PatchRealtorAsync(int id, Realtor realtor)
        {
            var exists = await _realtorRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            realtor.Id = id;
            var updated = await _realtorRepository.UpdateAsync(realtor);
            return Ok(updated);
        }

        /// <summary>Deletes realtor</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRealtorAsync(int id)
        {
            var deleted = await _realtorRepository.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}