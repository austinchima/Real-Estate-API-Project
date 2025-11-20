using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RealEstateAPI.controller
{
    public interface PorpertiesController<T>
    {
        
        Task<IEnumerable<T>> GetAllPropertiesAsync();
        Task<T?> GetPropertyByIdAsync(int id);
        Task<T> CreatePropertyAsync(T property);
        Task<T> UpdateAsyncPropertyAsync(int id, T property);
        Task<bool> DeletePropertyAsync(int id);
    }

    [ApiController]
    [Route("api/[controller]")]

    public class PorpertiesController : ControllerBase, PorpertiesController<Models.Property>
    {
        // Note: In a real application, you would inject a service or repository to handle data operations.
        private static readonly List<Models.Property> Properties = new List<Models.Property>();
        private static int _nextId = 1;

        [HttpGet]
        public async Task<IEnumerable<Models.Property>> GetAllPropertiesAsync()
        {
            return await Task.FromResult(Properties);
        }

        [HttpGet("{id}")]
        public async Task<Models.Property?> GetPropertyByIdAsync(int id)
        {
            var property = Properties.FirstOrDefault(p => p.Id == id);
            return await Task.FromResult(property);
        }

        [HttpPost]
        public async Task<Models.Property> CreatePropertyAsync(Models.Property property)
        {
            property.Id = _nextId++;
            property.ListedDate = DateTime.UtcNow;
            property.State = "Available";
            property.Status = "Active";
            property.Bathrooms = property.Bathrooms;
            property.Bedrooms = property.Bedrooms;
            property.SquareFeet = property.SquareFeet;
            property.City = property.City;
            property.ZipCode = property.ZipCode;
            Properties.Add(property);
            return await Task.FromResult(property);
        }

        [HttpPut("{id}")]
        public async Task<Models.Property> UpdateAsyncPropertyAsync(int id, Models.Property property)
        {
            var existingProperty = Properties.FirstOrDefault(p => p.Id == id);
            if (existingProperty == null)
            {
                throw new KeyNotFoundException("Property not found");
            }

            existingProperty.Address = property.Address;
            existingProperty.Price = property.Price;
            existingProperty.Description = property.Description;

            return await Task.FromResult(existingProperty);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeletePropertyAsync(int id)
        {
            var property = Properties.FirstOrDefault(p => p.Id == id);
            if (property == null)
            {
                return await Task.FromResult(false);
            }

            property.Status = "Deleted";
            return await Task.FromResult(true);
        }
    }
}