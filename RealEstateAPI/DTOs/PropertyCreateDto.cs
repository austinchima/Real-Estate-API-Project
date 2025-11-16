using System.ComponentModel.DataAnnotations;

namespace RealEstateAPI.DTOs;

/// <summary>
/// DTO for creating a new property
/// </summary>
public class PropertyCreateDto
{
    [Required]
    [StringLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string State { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, 100)]
    public int Bedrooms { get; set; }

    [Required]
    [Range(0, 100)]
    public int Bathrooms { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int SquareFeet { get; set; }

    [Required]
    [StringLength(50)]
    public string PropertyType { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;

    public int? RealtorId { get; set; }

    [Required]
    public DateTime ListedDate { get; set; }

    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;
}
