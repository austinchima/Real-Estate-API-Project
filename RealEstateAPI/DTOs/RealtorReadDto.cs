namespace RealEstateAPI.DTOs;

/// <summary>
/// DTO for reading realtor data
/// </summary>
public class RealtorReadDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string Agency { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
