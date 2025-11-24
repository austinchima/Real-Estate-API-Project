namespace RealEstateAPI.Models;

/// <summary>
/// Represents a user entity
/// </summary>
public class User
{
    /// <summary>
    /// Gets or sets the unique identifier for the user
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Gets or sets the first name of the user
    /// </summary>
    public string FirstName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the last name of the user
    /// </summary>
    public string LastName { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the email address of the user
    /// </summary>
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the phone number of the user
    /// </summary>
    public string PhoneNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the address of the user
    /// </summary>
    public string Address { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the date when the user was created
    /// </summary>
    public DateTime CreatedDate { get; set; }
    
    /// <summary>
    /// Gets or sets whether the user is currently active
    /// </summary>
    public bool IsActive { get; set; }
}
