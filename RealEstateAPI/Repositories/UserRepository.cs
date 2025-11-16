using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository implementation for User entity
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly RealEstateDbContext _context;

    public UserRepository(RealEstateDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all users asynchronously
    /// </summary>
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    /// <summary>
    /// Retrieves a single user by ID asynchronously
    /// </summary>
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    /// <summary>
    /// Creates a new user asynchronously
    /// </summary>
    public async Task<User> CreateAsync(User entity)
    {
        _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Updates an existing user asynchronously
    /// </summary>
    public async Task<User> UpdateAsync(User entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Deletes a user by ID asynchronously
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return false;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Checks if a user exists by ID asynchronously
    /// </summary>
    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }

    /// <summary>
    /// Retrieves a user by email address asynchronously
    /// </summary>
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}
