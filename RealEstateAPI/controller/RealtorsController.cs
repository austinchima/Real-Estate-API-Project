using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class RealtorsController : ControllerBase
    {
        private readonly IRealtorRepository _realtorRepository;

        public RealtorsController(IRealtorRepository realtorRepository)
        {
            _realtorRepository = realtorRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Realtor>> GetAllRealtorsAsync()
        {
            return await _realtorRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Realtor?> GetRealtorByIdAsync(int id)
        {
            return await _realtorRepository.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Realtor> CreateRealtorAsync(Realtor realtor)
        {
            return await _realtorRepository.CreateAsync(realtor);
        }

        [HttpPut("{id}")]
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

        [HttpDelete("{id}")]
        public async Task<bool> DeleteRealtorAsync(int id)
        {
            return await _realtorRepository.DeleteAsync(id);
        }
    }
}