namespace RealEstateAPI.Models;

/// <summary>
/// Represents a real estate property entity
/// </summary>
public class Property
{
    public int Id { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int SquareFeet { get; set; }
    public string PropertyType { get; set; } = string.Empty; // House, Condo, Apartment, etc.
    public string Status { get; set; } = string.Empty; // Available, Sold, Pending
    public int? RealtorId { get; set; }
    public Realtor? Realtor { get; set; }
    public DateTime ListedDate { get; set; }
    public string Description { get; set; } = string.Empty;
}
