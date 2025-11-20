using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RealEstateAPI.controller
{
    public interface IRealtorsController<T>
    {
        Task<IEnumerable<T>> GetAllRealtorsAsync();
        Task<T?> GetRealtorByIdAsync(int id);
        Task<T> CreateRealtorAsync(T realtor);
        Task<T> UpdateAsyncRealtorAsync(int id, T realtor);
        Task<bool> DeleteRealtorAsync(int id);
    }

    [ApiController]
    [Route("api/[controller]")]
    public class RealtorsController : ControllerBase, IRealtorsController<Models.Realtor>
    {
        private static readonly List<Models.Realtor> Realtors = new List<Models.Realtor>();
        private static int _nextId = 1;

        [HttpGet]
        public async Task<IEnumerable<Models.Realtor>> GetAllRealtorsAsync()
        {
            return await Task.FromResult(Realtors);
        }

        [HttpGet("{id}")]
        public async Task<Models.Realtor?> GetRealtorByIdAsync(int id)
        {
            var realtor = Realtors.FirstOrDefault(r => r.Id == id);
            return await Task.FromResult(realtor);
        }

        [HttpPost]
        public async Task<Models.Realtor> CreateRealtorAsync(Models.Realtor realtor)
        {
            realtor.Id = _nextId++;
            realtor.IsActive = true;
            Realtors.Add(realtor);
            return await Task.FromResult(realtor);
        }

        [HttpPut("{id}")]
        public async Task<Models.Realtor> UpdateAsyncRealtorAsync(int id, Models.Realtor realtor)
        {
            var existingRealtor = Realtors.FirstOrDefault(r => r.Id == id);
            if (existingRealtor == null)
            {
                throw new KeyNotFoundException("Realtor not found");
            }

            existingRealtor.FirstName = realtor.FirstName;
            existingRealtor.LastName = realtor.LastName;
            existingRealtor.Email = realtor.Email;
            existingRealtor.PhoneNumber = realtor.PhoneNumber;
            existingRealtor.LicenseNumber = realtor.LicenseNumber;
            existingRealtor.Agency = realtor.Agency;
            existingRealtor.YearsOfExperience = realtor.YearsOfExperience;
            existingRealtor.Specialization = realtor.Specialization;
            existingRealtor.IsActive = realtor.IsActive;

            return await Task.FromResult(existingRealtor);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteRealtorAsync(int id)
        {
            var realtor = Realtors.FirstOrDefault(r => r.Id == id);
            if (realtor == null)
            {
                return await Task.FromResult(false);
            }

            realtor.IsActive = false;
            return await Task.FromResult(true);
        }
    }
}