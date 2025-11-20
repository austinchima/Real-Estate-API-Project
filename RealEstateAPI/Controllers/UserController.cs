using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.controller
{
    /// <summary>
    /// API Controller for User CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        /// <summary> Constructor with dependency injection </summary>
        /// <param name="userRepository"></param>
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>Gets all users</summary>
        [HttpGet]
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        /// <summary>Gets user by ID</summary>
        [HttpGet("{id}")]
        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        /// <summary>Creates new user</summary>
        [HttpPost]
        public async Task<User> CreateUserAsync(User user)
        {
            return await _userRepository.CreateAsync(user);
        }

        /// <summary>Updates user</summary>
        [HttpPatch("{id}")]
        public async Task<User> UpdateAsyncUserAsync(int id, User user)
        {
            var exists = await _userRepository.ExistsAsync(id);
            if (!exists)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            user.Id = id;
            return await _userRepository.UpdateAsync(user);
        }

        /// <summary>Deletes user</summary>
        [HttpDelete("{id}")]
        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteAsync(id);
        }
    }
}