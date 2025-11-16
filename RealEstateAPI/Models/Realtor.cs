namespace RealEstateAPI.Models;

/// <summary>
/// Represents a realtor entity
/// </summary>
public class Realtor
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
    public ICollection<Property> Properties { get; set; } = new List<Property>();
}
