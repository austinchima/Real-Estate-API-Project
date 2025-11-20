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
        Task AddRealtorAsync(Realtor realtor);
        Task UpdateRealtorAsync(Realtor realtor);
        Task DeleteRealtorAsync(int id);
        Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId);
        Task AddPropertyToRealtorAsync(int realtorId, Property property);
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

        public async Task AddRealtorAsync(Realtor realtor)
        {
            await _realtorRepository.CreateAsync(realtor);
        }

        public async Task UpdateRealtorAsync(Realtor realtor)
        {
            await _realtorRepository.UpdateAsync(realtor);
        }

        public async Task DeleteRealtorAsync(int id)
        {
            await _realtorRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId)
        {
            return await _propertyRepository.GetByRealtorIdAsync(realtorId);
        }

        public async Task AddPropertyToRealtorAsync(int realtorId, Property property)
        {
            property.RealtorId = realtorId;
            await _propertyRepository.CreateAsync(property);
        }
        
    }
}