using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.Services
{
    public interface IRealtorService
    {
        Task<IEnumerable<Realtor>> GetAllRealtorsAsync();
        Task<Realtor?> GetRealtorByIdAsync(int id);
        Task<Realtor> CreateRealtorAsync(Realtor realtor);
        Task<Realtor> UpdateRealtorAsync(int id, Realtor realtor);
        Task<bool> DeleteRealtorAsync(int id);
        Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId);
    }

    /// <summary>
    /// Business logic layer for Realtor operations
    /// </summary>
    public class RealtorService : IRealtorService
    {
        private readonly IRealtorRepository _realtorRepository;
        private readonly IPropertyRepository _propertyRepository;

        public RealtorService(IRealtorRepository realtorRepository, IPropertyRepository propertyRepository)
        {
            _realtorRepository = realtorRepository;
            _propertyRepository = propertyRepository;
        }

        public async Task<IEnumerable<Realtor>> GetAllRealtorsAsync()
        {
            return await _realtorRepository.GetAllAsync();
        }

        public async Task<Realtor?> GetRealtorByIdAsync(int id)
        {
            return await _realtorRepository.GetByIdAsync(id);
        }

        public async Task<Realtor> CreateRealtorAsync(Realtor realtor)
        {
            return await _realtorRepository.CreateAsync(realtor);
        }

        public async Task<Realtor> UpdateRealtorAsync(int id, Realtor realtor)
        {
            var exists = await _realtorRepository.ExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException("Realtor not found");
            
            realtor.Id = id;
            return await _realtorRepository.UpdateAsync(realtor);
        }

        public async Task<bool> DeleteRealtorAsync(int id)
        {
            return await _realtorRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId)
        {
            return await _propertyRepository.GetByRealtorIdAsync(realtorId);
        }


        
    }
}