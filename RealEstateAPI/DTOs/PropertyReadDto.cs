namespace RealEstateAPI.DTOs;

/// <summary>
/// DTO for reading property data
/// </summary>
public class PropertyReadDto
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
    public string PropertyType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int? RealtorId { get; set; }
    public DateTime ListedDate { get; set; }
    public string Description { get; set; } = string.Empty;
}
