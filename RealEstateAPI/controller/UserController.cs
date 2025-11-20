using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RealEstateAPI.controller
{
    public interface UserController<T>
    {
        
        Task<IEnumerable<T>> GetAllUsersAsync();
        Task<T?> GetUserByIdAsync(int id);
        Task<T> CreateUserAsync(T user);
        Task<T> UpdateAsyncUserAsync(int id, T user);
        Task<bool> DeleteUserAsync(int id);
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase, UserController<Models.User>
    {
        // Note: In a real application, you would inject a service or repository to handle data operations.
        private static readonly List<Models.User> Users = new List<Models.User>();
        private static int _nextId = 1;

        [HttpGet]
        public async Task<IEnumerable<Models.User>> GetAllUsersAsync()
        {
            return await Task.FromResult(Users);
        }

        [HttpGet("{id}")]
        public async Task<Models.User?> GetUserByIdAsync(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            return await Task.FromResult(user);
        }

        [HttpPost]
        public async Task<Models.User> CreateUserAsync(Models.User user)
        {
            user.Id = _nextId++;
            user.CreatedDate = DateTime.UtcNow;
            Users.Add(user);
            return await Task.FromResult(user);
        }

        [HttpPut("{id}")]
        public async Task<Models.User> UpdateAsyncUserAsync(int id, Models.User user)
        {
            var existingUser = Users.FirstOrDefault(u => u.Id == id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Address = user.Address;
            existingUser.IsActive = user.IsActive;

            return await Task.FromResult(existingUser);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return await Task.FromResult(false);
            }

            user.IsActive = false;
            return await Task.FromResult(true);
        }
    }
}