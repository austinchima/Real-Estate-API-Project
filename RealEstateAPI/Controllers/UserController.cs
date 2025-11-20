using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Models;
using RealEstateAPI.Repositories;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for User CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        /// <summary>Constructor with dependency injection</summary>
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>Gets all users</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }

        /// <summary>Gets user by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        /// <summary>Creates new user</summary>
        [HttpPost]
        public async Task<ActionResult<User>> CreateUserAsync(User user)
        {
            var created = await _userRepository.CreateAsync(user);
            return CreatedAtAction(nameof(GetUserByIdAsync), new { id = created.Id }, created);
        }

        /// <summary>Updates entire user</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUserAsync(int id, User user)
        {
            var exists = await _userRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            user.Id = id;
            var updated = await _userRepository.UpdateAsync(user);
            return Ok(updated);
        }

        /// <summary>Partially updates user</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<User>> PatchUserAsync(int id, User user)
        {
            var exists = await _userRepository.ExistsAsync(id);
            if (!exists)
                return NotFound();
            
            user.Id = id;
            var updated = await _userRepository.UpdateAsync(user);
            return Ok(updated);
        }

        /// <summary>Deletes user (logical delete)</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            
            user.IsActive = false;
            await _userRepository.UpdateAsync(user);
            return NoContent();
        }
    }
}