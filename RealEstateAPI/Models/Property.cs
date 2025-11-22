namespace RealEstateAPI.Models;

/// <summary>
/// Represents a real estate property entity
/// </summary>
public class Property
{
    /// <summary>
    /// Gets or sets the unique identifier for the property
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Gets or sets the street address of the property
    /// </summary>
    public string Address { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the city where the property is located
    /// </summary>
    public string City { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the state where the property is located
    /// </summary>
    public string State { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the ZIP code of the property location
    /// </summary>
    public string ZipCode { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the listing price of the property
    /// </summary>
    public decimal Price { get; set; }
    
    /// <summary>
    /// Gets or sets the number of bedrooms in the property
    /// </summary>
    public int Bedrooms { get; set; }
    
    /// <summary>
    /// Gets or sets the number of bathrooms in the property
    /// </summary>
    public int Bathrooms { get; set; }
    
    /// <summary>
    /// Gets or sets the total square footage of the property
    /// </summary>
    public int SquareFeet { get; set; }
    
    /// <summary>
    /// Gets or sets the type of property (House, Condo, Apartment, etc.)
    /// </summary>
    public string PropertyType { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the current status of the property (Available, Sold, Pending)
    /// </summary>
    public string Status { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets or sets the ID of the realtor managing this property
    /// </summary>
    public int? RealtorId { get; set; }
    
    /// <summary>
    /// Gets or sets the realtor entity associated with this property
    /// </summary>
    public Realtor? Realtor { get; set; }
    
    /// <summary>
    /// Gets or sets the date when the property was listed
    /// </summary>
    public DateTime ListedDate { get; set; }
    
    /// <summary>
    /// Gets or sets the detailed description of the property
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether the property is deleted
    /// </summary>
    public bool IsDeleted { get; set; } = false;
}
