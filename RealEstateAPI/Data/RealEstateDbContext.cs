using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Models;

namespace RealEstateAPI.Data;

/// <summary>
/// Database context for the Real Estate API
/// </summary>
public class RealEstateDbContext : DbContext
{
    public RealEstateDbContext(DbContextOptions<RealEstateDbContext> options)
        : base(options)
    {
    }

    public DbSet<Property> Properties { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Realtor> Realtors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Property configuration
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(p => p.Id);
            
            entity.Property(p => p.Address)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(p => p.City)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(p => p.State)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(p => p.ZipCode)
                .IsRequired()
                .HasMaxLength(10);
            
            entity.Property(p => p.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");
            
            entity.Property(p => p.PropertyType)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(p => p.Status)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(p => p.Description)
                .HasMaxLength(1000);
            
            // Configure relationship with Realtor
            entity.HasOne(p => p.Realtor)
                .WithMany(r => r.Properties)
                .HasForeignKey(p => p.RealtorId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            
            entity.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);
            
            entity.HasIndex(u => u.Email)
                .IsUnique();
            
            entity.Property(u => u.PhoneNumber)
                .HasMaxLength(20);
            
            entity.Property(u => u.Address)
                .HasMaxLength(200);
            
            entity.Property(u => u.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
        });

        // Realtor configuration
        modelBuilder.Entity<Realtor>(entity =>
        {
            entity.HasKey(r => r.Id);
            
            entity.Property(r => r.FirstName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(r => r.LastName)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(r => r.Email)
                .IsRequired()
                .HasMaxLength(255);
            
            entity.HasIndex(r => r.Email)
                .IsUnique();
            
            entity.Property(r => r.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.Property(r => r.LicenseNumber)
                .IsRequired()
                .HasMaxLength(50);
            
            entity.HasIndex(r => r.LicenseNumber)
                .IsUnique();
            
            entity.Property(r => r.Agency)
                .IsRequired()
                .HasMaxLength(200);
            
            entity.Property(r => r.Specialization)
                .HasMaxLength(100);
            
            entity.Property(r => r.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
        });

        // Seed data for Realtors
        modelBuilder.Entity<Realtor>().HasData(
            new Realtor { Id = 1, FirstName = "Sarah", LastName = "Johnson", Email = "sarah.johnson@realty.com", PhoneNumber = "555-0101", LicenseNumber = "RE-2024-001", Agency = "Prime Realty Group", YearsOfExperience = 8, Specialization = "Residential", IsActive = true },
            new Realtor { Id = 2, FirstName = "Michael", LastName = "Chen", Email = "michael.chen@realty.com", PhoneNumber = "555-0102", LicenseNumber = "RE-2024-002", Agency = "Luxury Estates Inc", YearsOfExperience = 12, Specialization = "Luxury Homes", IsActive = true },
            new Realtor { Id = 3, FirstName = "Emily", LastName = "Rodriguez", Email = "emily.rodriguez@realty.com", PhoneNumber = "555-0103", LicenseNumber = "RE-2024-003", Agency = "Urban Living Realty", YearsOfExperience = 5, Specialization = "Condos", IsActive = true },
            new Realtor { Id = 4, FirstName = "David", LastName = "Thompson", Email = "david.thompson@realty.com", PhoneNumber = "555-0104", LicenseNumber = "RE-2024-004", Agency = "Coastal Properties", YearsOfExperience = 15, Specialization = "Waterfront", IsActive = true },
            new Realtor { Id = 5, FirstName = "Jessica", LastName = "Martinez", Email = "jessica.martinez@realty.com", PhoneNumber = "555-0105", LicenseNumber = "RE-2024-005", Agency = "Metro Realty Partners", YearsOfExperience = 6, Specialization = "Commercial", IsActive = true },
            new Realtor { Id = 6, FirstName = "Robert", LastName = "Anderson", Email = "robert.anderson@realty.com", PhoneNumber = "555-0106", LicenseNumber = "RE-2024-006", Agency = "Family Home Realty", YearsOfExperience = 10, Specialization = "Family Homes", IsActive = true },
            new Realtor { Id = 7, FirstName = "Amanda", LastName = "Lee", Email = "amanda.lee@realty.com", PhoneNumber = "555-0107", LicenseNumber = "RE-2024-007", Agency = "Downtown Realty", YearsOfExperience = 4, Specialization = "Urban", IsActive = true },
            new Realtor { Id = 8, FirstName = "Christopher", LastName = "Wilson", Email = "chris.wilson@realty.com", PhoneNumber = "555-0108", LicenseNumber = "RE-2024-008", Agency = "Suburban Living Realty", YearsOfExperience = 9, Specialization = "Suburban", IsActive = true },
            new Realtor { Id = 9, FirstName = "Nicole", LastName = "Brown", Email = "nicole.brown@realty.com", PhoneNumber = "555-0109", LicenseNumber = "RE-2024-009", Agency = "Investment Properties LLC", YearsOfExperience = 7, Specialization = "Investment", IsActive = true },
            new Realtor { Id = 10, FirstName = "James", LastName = "Taylor", Email = "james.taylor@realty.com", PhoneNumber = "555-0110", LicenseNumber = "RE-2024-010", Agency = "Green Valley Realty", YearsOfExperience = 11, Specialization = "Rural", IsActive = true }
        );

        // Seed data for Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FirstName = "John", LastName = "Smith", Email = "john.smith@email.com", PhoneNumber = "555-1001", Address = "123 Main St, Anytown, CA 90210", CreatedDate = new DateTime(2024, 1, 15), IsActive = true },
            new User { Id = 2, FirstName = "Emma", LastName = "Davis", Email = "emma.davis@email.com", PhoneNumber = "555-1002", Address = "456 Oak Ave, Springfield, IL 62701", CreatedDate = new DateTime(2024, 2, 20), IsActive = true },
            new User { Id = 3, FirstName = "William", LastName = "Garcia", Email = "william.garcia@email.com", PhoneNumber = "555-1003", Address = "789 Pine Rd, Portland, OR 97201", CreatedDate = new DateTime(2024, 3, 10), IsActive = true },
            new User { Id = 4, FirstName = "Olivia", LastName = "Miller", Email = "olivia.miller@email.com", PhoneNumber = "555-1004", Address = "321 Elm St, Austin, TX 78701", CreatedDate = new DateTime(2024, 4, 5), IsActive = true },
            new User { Id = 5, FirstName = "Daniel", LastName = "Wilson", Email = "daniel.wilson@email.com", PhoneNumber = "555-1005", Address = "654 Maple Dr, Seattle, WA 98101", CreatedDate = new DateTime(2024, 5, 12), IsActive = true },
            new User { Id = 6, FirstName = "Sophia", LastName = "Moore", Email = "sophia.moore@email.com", PhoneNumber = "555-1006", Address = "987 Cedar Ln, Denver, CO 80201", CreatedDate = new DateTime(2024, 6, 18), IsActive = true },
            new User { Id = 7, FirstName = "Matthew", LastName = "Taylor", Email = "matthew.taylor@email.com", PhoneNumber = "555-1007", Address = "147 Birch Ct, Miami, FL 33101", CreatedDate = new DateTime(2024, 7, 22), IsActive = true },
            new User { Id = 8, FirstName = "Isabella", LastName = "Anderson", Email = "isabella.anderson@email.com", PhoneNumber = "555-1008", Address = "258 Spruce Way, Boston, MA 02101", CreatedDate = new DateTime(2024, 8, 8), IsActive = true },
            new User { Id = 9, FirstName = "Ethan", LastName = "Thomas", Email = "ethan.thomas@email.com", PhoneNumber = "555-1009", Address = "369 Willow Blvd, Phoenix, AZ 85001", CreatedDate = new DateTime(2024, 9, 14), IsActive = true },
            new User { Id = 10, FirstName = "Mia", LastName = "Jackson", Email = "mia.jackson@email.com", PhoneNumber = "555-1010", Address = "741 Ash Pl, Nashville, TN 37201", CreatedDate = new DateTime(2024, 10, 1), IsActive = true }
        );

        // Seed data for Properties
        modelBuilder.Entity<Property>().HasData(
            new Property { Id = 1, Address = "1234 Sunset Blvd", City = "Los Angeles", State = "CA", ZipCode = "90028", Price = 850000m, Bedrooms = 4, Bathrooms = 3, SquareFeet = 2500, PropertyType = "House", Status = "Available", RealtorId = 1, ListedDate = new DateTime(2024, 10, 1), Description = "Beautiful modern home with stunning views" },
            new Property { Id = 2, Address = "567 Park Avenue", City = "New York", State = "NY", ZipCode = "10022", Price = 1200000m, Bedrooms = 3, Bathrooms = 2, SquareFeet = 1800, PropertyType = "Condo", Status = "Available", RealtorId = 2, ListedDate = new DateTime(2024, 10, 5), Description = "Luxury condo in prime location" },
            new Property { Id = 3, Address = "890 Lake Shore Drive", City = "Chicago", State = "IL", ZipCode = "60611", Price = 675000m, Bedrooms = 2, Bathrooms = 2, SquareFeet = 1500, PropertyType = "Apartment", Status = "Pending", RealtorId = 3, ListedDate = new DateTime(2024, 9, 15), Description = "Lakefront apartment with amazing amenities" },
            new Property { Id = 4, Address = "2345 Ocean View Road", City = "Miami", State = "FL", ZipCode = "33139", Price = 950000m, Bedrooms = 5, Bathrooms = 4, SquareFeet = 3200, PropertyType = "House", Status = "Available", RealtorId = 4, ListedDate = new DateTime(2024, 10, 10), Description = "Beachfront property with private access" },
            new Property { Id = 5, Address = "678 Mountain Trail", City = "Denver", State = "CO", ZipCode = "80202", Price = 725000m, Bedrooms = 4, Bathrooms = 3, SquareFeet = 2800, PropertyType = "House", Status = "Available", RealtorId = 5, ListedDate = new DateTime(2024, 10, 12), Description = "Mountain retreat with panoramic views" },
            new Property { Id = 6, Address = "901 Downtown Plaza", City = "Seattle", State = "WA", ZipCode = "98101", Price = 580000m, Bedrooms = 2, Bathrooms = 2, SquareFeet = 1400, PropertyType = "Condo", Status = "Sold", RealtorId = 6, ListedDate = new DateTime(2024, 8, 20), Description = "Modern downtown condo near tech hub" },
            new Property { Id = 7, Address = "3456 Suburban Lane", City = "Austin", State = "TX", ZipCode = "78701", Price = 495000m, Bedrooms = 3, Bathrooms = 2, SquareFeet = 2000, PropertyType = "House", Status = "Available", RealtorId = 7, ListedDate = new DateTime(2024, 10, 8), Description = "Family-friendly home in great school district" },
            new Property { Id = 8, Address = "789 Historic District", City = "Boston", State = "MA", ZipCode = "02101", Price = 890000m, Bedrooms = 3, Bathrooms = 3, SquareFeet = 2200, PropertyType = "Townhouse", Status = "Available", RealtorId = 8, ListedDate = new DateTime(2024, 10, 3), Description = "Charming historic townhouse fully renovated" },
            new Property { Id = 9, Address = "1122 Desert Vista", City = "Phoenix", State = "AZ", ZipCode = "85001", Price = 425000m, Bedrooms = 3, Bathrooms = 2, SquareFeet = 1900, PropertyType = "House", Status = "Available", RealtorId = 9, ListedDate = new DateTime(2024, 10, 14), Description = "Desert oasis with pool and landscaping" },
            new Property { Id = 10, Address = "4567 Music Row", City = "Nashville", State = "TN", ZipCode = "37201", Price = 615000m, Bedrooms = 4, Bathrooms = 3, SquareFeet = 2400, PropertyType = "House", Status = "Pending", RealtorId = 10, ListedDate = new DateTime(2024, 9, 28), Description = "Contemporary home near entertainment district" }
        );

        base.OnModelCreating(modelBuilder);
    }
}
