using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository implementation for Property entity
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly RealEstateDbContext _context;

    public PropertyRepository(RealEstateDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all properties asynchronously
    /// </summary>
    public async Task<IEnumerable<Property>> GetAllAsync()
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single property by ID asynchronously
    /// </summary>
    public async Task<Property?> GetByIdAsync(int id)
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    /// <summary>
    /// Creates a new property asynchronously
    /// </summary>
    public async Task<Property> CreateAsync(Property entity)
    {
        _context.Properties.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Updates an existing property asynchronously
    /// </summary>
    public async Task<Property> UpdateAsync(Property entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Deletes a property by ID asynchronously
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var property = await _context.Properties.FindAsync(id);
        if (property == null)
        {
            return false;
        }

        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Checks if a property exists by ID asynchronously
    /// </summary>
    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Properties.AnyAsync(p => p.Id == id);
    }

    /// <summary>
    /// Retrieves properties by property type asynchronously
    /// </summary>
    public async Task<IEnumerable<Property>> GetByPropertyTypeAsync(string propertyType)
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .Where(p => p.PropertyType == propertyType)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves properties by realtor ID asynchronously
    /// </summary>
    public async Task<IEnumerable<Property>> GetByRealtorIdAsync(int realtorId)
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .Where(p => p.RealtorId == realtorId)
            .ToListAsync();
    }
}
