namespace RealEstateAPI.Models;

/// <summary>
/// Represents a realtor entity
/// </summary>
public class Realtor
{
    /// <summary>
    /// Gets or sets the unique identifier for the realtor
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Gets or sets the first name of the realtor
    /// </summary>
    public string FirstName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the last name of the realtor
    /// </summary>
    public string LastName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the email address of the realtor
    /// </summary>
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the phone number of the realtor
    /// </summary>
    public string PhoneNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the license number of the realtor
    /// </summary>
    public string LicenseNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the agency the realtor works for
    /// </summary>
    public string Agency { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the years of experience the realtor has
    /// </summary>
    public int YearsOfExperience { get; set; }
    
    /// <summary>
    /// Gets or sets the specialization area of the realtor
    /// </summary>
    public string Specialization { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets whether the realtor is currently active
    /// </summary>
    public bool IsActive { get; set; }
    
    /// <summary>
    /// Gets or sets the collection of properties managed by this realtor
    /// </summary>
    public ICollection<Property> Properties { get; set; } = new List<Property>();
}
