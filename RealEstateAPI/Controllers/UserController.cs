using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using AutoMapper;
using RealEstateAPI.Services;
using RealEstateAPI.DTOs;

namespace RealEstateAPI.Controllers
{
    /// <summary>
    /// API Controller for User CRUD operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        /// <summary>Constructor with dependency injection</summary>
        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        /// <summary>Gets all users</summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetAllUsersAsync()
        {
            var users = await _userService.GetAllUsersAsync();
            var userDtos = _mapper.Map<IEnumerable<UserReadDto>>(users);
            return Ok(userDtos);
        }

        /// <summary>Gets user by ID</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDto>> GetUserByIdAsync(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();
            
            var userDto = _mapper.Map<UserReadDto>(user);
            return Ok(userDto);
        }

        /// <summary>Creates new user</summary>
        [HttpPost]
        public async Task<ActionResult<UserReadDto>> CreateUserAsync(UserCreateDto userCreateDto)
        {
            var user = _mapper.Map<RealEstateAPI.Models.User>(userCreateDto);
            var created = await _userService.CreateUserAsync(user);
            var createdDto = _mapper.Map<UserReadDto>(created);
            return CreatedAtAction(nameof(GetUserByIdAsync), new { id = created.Id }, createdDto);
        }

        /// <summary>Updates entire user</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<UserReadDto>> UpdateUserAsync(int id, UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = _mapper.Map<RealEstateAPI.Models.User>(userUpdateDto);
                var updated = await _userService.UpdateUserAsync(id, user);
                var updatedDto = _mapper.Map<UserReadDto>(updated);
                return Ok(updatedDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>Partially updates user</summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<UserReadDto>> PatchUserAsync(int id, JsonPatchDocument<UserUpdateDto> patchDoc)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            var userToPatch = _mapper.Map<UserUpdateDto>(user);
            patchDoc.ApplyTo(userToPatch, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _mapper.Map(userToPatch, user);
            var updated = await _userService.UpdateUserAsync(id, user);
            var updatedDto = _mapper.Map<UserReadDto>(updated);
            return Ok(updatedDto);
        }

        /// <summary>Deletes user</summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUserAsync(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}