using System.ComponentModel.DataAnnotations;

namespace RealEstateAPI.DTOs;

/// <summary>
/// DTO for updating an existing user
/// </summary>
public class UserUpdateDto
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

    [Phone]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedDate { get; set; }

    [Required]
    public bool IsActive { get; set; }
}
