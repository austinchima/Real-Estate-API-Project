using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository interface for User entity with additional query methods
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Retrieves a user by email address asynchronously
    /// </summary>
    /// <param name="email">User email address</param>
    /// <returns>User if found, null otherwise</returns>
    Task<User?> GetByEmailAsync(string email);
}
