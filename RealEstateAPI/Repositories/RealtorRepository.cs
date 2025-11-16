using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Repositories;

/// <summary>
/// Repository implementation for Realtor entity
/// </summary>
public class RealtorRepository : IRealtorRepository
{
    private readonly RealEstateDbContext _context;

    public RealtorRepository(RealEstateDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all realtors asynchronously
    /// </summary>
    public async Task<IEnumerable<Realtor>> GetAllAsync()
    {
        return await _context.Realtors.ToListAsync();
    }

    /// <summary>
    /// Retrieves a single realtor by ID asynchronously
    /// </summary>
    public async Task<Realtor?> GetByIdAsync(int id)
    {
        return await _context.Realtors.FirstOrDefaultAsync(r => r.Id == id);
    }

    /// <summary>
    /// Creates a new realtor asynchronously
    /// </summary>
    public async Task<Realtor> CreateAsync(Realtor entity)
    {
        _context.Realtors.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Updates an existing realtor asynchronously
    /// </summary>
    public async Task<Realtor> UpdateAsync(Realtor entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Deletes a realtor by ID asynchronously
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var realtor = await _context.Realtors.FindAsync(id);
        if (realtor == null)
        {
            return false;
        }

        _context.Realtors.Remove(realtor);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Checks if a realtor exists by ID asynchronously
    /// </summary>
    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Realtors.AnyAsync(r => r.Id == id);
    }

    /// <summary>
    /// Retrieves realtors by agency name asynchronously
    /// </summary>
    public async Task<IEnumerable<Realtor>> GetByAgencyAsync(string agency)
    {
        return await _context.Realtors
            .Where(r => r.Agency == agency)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a realtor with their associated properties asynchronously
    /// </summary>
    public async Task<Realtor?> GetWithPropertiesAsync(int id)
    {
        return await _context.Realtors
            .Include(r => r.Properties)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}
