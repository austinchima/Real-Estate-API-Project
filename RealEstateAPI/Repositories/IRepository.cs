namespace RealEstateAPI.Repositories;

/// <summary>
/// Generic repository interface for common CRUD operations
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Retrieves all entities asynchronously
    /// </summary>
    /// <returns>Collection of all entities</returns>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Retrieves a single entity by its ID asynchronously
    /// </summary>
    /// <param name="id">Entity ID</param>
    /// <returns>Entity if found, null otherwise</returns>
    Task<T?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new entity asynchronously
    /// </summary>
    /// <param name="entity">Entity to create</param>
    /// <returns>Created entity</returns>
    Task<T> CreateAsync(T entity);

    /// <summary>
    /// Updates an existing entity asynchronously
    /// </summary>
    /// <param name="entity">Entity to update</param>
    /// <returns>Updated entity</returns>
    Task<T> UpdateAsync(T entity);

    /// <summary>
    /// Deletes an entity by its ID asynchronously
    /// </summary>
    /// <param name="id">Entity ID</param>
    /// <returns>True if deleted successfully, false otherwise</returns>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Checks if an entity exists by its ID asynchronously
    /// </summary>
    /// <param name="id">Entity ID</param>
    /// <returns>True if entity exists, false otherwise</returns>
    Task<bool> ExistsAsync(int id);
}
