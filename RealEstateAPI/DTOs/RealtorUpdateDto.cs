using System.ComponentModel.DataAnnotations;

namespace RealEstateAPI.DTOs;

/// <summary>
/// DTO for updating an existing realtor
/// </summary>
public class RealtorUpdateDto
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Agency { get; set; } = string.Empty;

    [Required]
    [Range(0, 100)]
    public int YearsOfExperience { get; set; }

    [StringLength(100)]
    public string Specialization { get; set; } = string.Empty;

    [Required]
    public bool IsActive { get; set; }
}
