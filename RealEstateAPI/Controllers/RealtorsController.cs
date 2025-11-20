using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.controller
{
    /// <summary>
    /// API Controller for Realtor CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RealtorsController : ControllerBase
    {
        private readonly IRealtorRepository _realtorRepository;

        /// <summary> Constructor with dependency injection </summary>
        /// <param name="realtorRepository"></param>
        public RealtorsController(IRealtorRepository realtorRepository)
        {
            _realtorRepository = realtorRepository;
        }

        /// <summary>Gets all realtors</summary>
        [HttpGet]
        public async Task<IEnumerable<Realtor>> GetAllRealtorsAsync()
        {
            return await _realtorRepository.GetAllAsync();
        }

        /// <summary>Gets realtor by ID</summary>
        [HttpGet("{id}")]
        public async Task<Realtor?> GetRealtorByIdAsync(int id)
        {
            return await _realtorRepository.GetByIdAsync(id);
        }

        /// <summary>Creates new realtor</summary>
        [HttpPost]
        public async Task<Realtor> CreateRealtorAsync(Realtor realtor)
        {
            return await _realtorRepository.CreateAsync(realtor);
        }

        /// <summary>Updates realtor</summary>
        [HttpPatch("{id}")]
        public async Task<Realtor> UpdateAsyncRealtorAsync(int id, Realtor realtor)
        {
            var exists = await _realtorRepository.ExistsAsync(id);
            if (!exists)
            {
                throw new KeyNotFoundException("Realtor not found");
            }
            
            realtor.Id = id;
            return await _realtorRepository.UpdateAsync(realtor);
        }

        /// <summary>Deletes realtor</summary>
        [HttpDelete("{id}")]
        public async Task<bool> DeleteRealtorAsync(int id)
        {
            return await _realtorRepository.DeleteAsync(id);
        }
    }
}