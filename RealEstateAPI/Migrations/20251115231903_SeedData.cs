using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealEstateAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Realtors",
                columns: new[] { "Id", "Agency", "Email", "FirstName", "IsActive", "LastName", "LicenseNumber", "PhoneNumber", "Specialization", "YearsOfExperience" },
                values: new object[,]
                {
                    { 1, "Prime Realty Group", "sarah.johnson@realty.com", "Sarah", true, "Johnson", "RE-2024-001", "555-0101", "Residential", 8 },
                    { 2, "Luxury Estates Inc", "michael.chen@realty.com", "Michael", true, "Chen", "RE-2024-002", "555-0102", "Luxury Homes", 12 },
                    { 3, "Urban Living Realty", "emily.rodriguez@realty.com", "Emily", true, "Rodriguez", "RE-2024-003", "555-0103", "Condos", 5 },
                    { 4, "Coastal Properties", "david.thompson@realty.com", "David", true, "Thompson", "RE-2024-004", "555-0104", "Waterfront", 15 },
                    { 5, "Metro Realty Partners", "jessica.martinez@realty.com", "Jessica", true, "Martinez", "RE-2024-005", "555-0105", "Commercial", 6 },
                    { 6, "Family Home Realty", "robert.anderson@realty.com", "Robert", true, "Anderson", "RE-2024-006", "555-0106", "Family Homes", 10 },
                    { 7, "Downtown Realty", "amanda.lee@realty.com", "Amanda", true, "Lee", "RE-2024-007", "555-0107", "Urban", 4 },
                    { 8, "Suburban Living Realty", "chris.wilson@realty.com", "Christopher", true, "Wilson", "RE-2024-008", "555-0108", "Suburban", 9 },
                    { 9, "Investment Properties LLC", "nicole.brown@realty.com", "Nicole", true, "Brown", "RE-2024-009", "555-0109", "Investment", 7 },
                    { 10, "Green Valley Realty", "james.taylor@realty.com", "James", true, "Taylor", "RE-2024-010", "555-0110", "Rural", 11 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedDate", "Email", "FirstName", "IsActive", "LastName", "PhoneNumber" },
                values: new object[,]
                {
                    { 1, "123 Main St, Anytown, CA 90210", new DateTime(2024, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "john.smith@email.com", "John", true, "Smith", "555-1001" },
                    { 2, "456 Oak Ave, Springfield, IL 62701", new DateTime(2024, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "emma.davis@email.com", "Emma", true, "Davis", "555-1002" },
                    { 3, "789 Pine Rd, Portland, OR 97201", new DateTime(2024, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "william.garcia@email.com", "William", true, "Garcia", "555-1003" },
                    { 4, "321 Elm St, Austin, TX 78701", new DateTime(2024, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "olivia.miller@email.com", "Olivia", true, "Miller", "555-1004" },
                    { 5, "654 Maple Dr, Seattle, WA 98101", new DateTime(2024, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "daniel.wilson@email.com", "Daniel", true, "Wilson", "555-1005" },
                    { 6, "987 Cedar Ln, Denver, CO 80201", new DateTime(2024, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "sophia.moore@email.com", "Sophia", true, "Moore", "555-1006" },
                    { 7, "147 Birch Ct, Miami, FL 33101", new DateTime(2024, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "matthew.taylor@email.com", "Matthew", true, "Taylor", "555-1007" },
                    { 8, "258 Spruce Way, Boston, MA 02101", new DateTime(2024, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "isabella.anderson@email.com", "Isabella", true, "Anderson", "555-1008" },
                    { 9, "369 Willow Blvd, Phoenix, AZ 85001", new DateTime(2024, 9, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "ethan.thomas@email.com", "Ethan", true, "Thomas", "555-1009" },
                    { 10, "741 Ash Pl, Nashville, TN 37201", new DateTime(2024, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "mia.jackson@email.com", "Mia", true, "Jackson", "555-1010" }
                });

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "Address", "Bathrooms", "Bedrooms", "City", "Description", "ListedDate", "Price", "PropertyType", "RealtorId", "SquareFeet", "State", "Status", "ZipCode" },
                values: new object[,]
                {
                    { 1, "1234 Sunset Blvd", 3, 4, "Los Angeles", "Beautiful modern home with stunning views", new DateTime(2024, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 850000m, "House", 1, 2500, "CA", "Available", "90028" },
                    { 2, "567 Park Avenue", 2, 3, "New York", "Luxury condo in prime location", new DateTime(2024, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 1200000m, "Condo", 2, 1800, "NY", "Available", "10022" },
                    { 3, "890 Lake Shore Drive", 2, 2, "Chicago", "Lakefront apartment with amazing amenities", new DateTime(2024, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 675000m, "Apartment", 3, 1500, "IL", "Pending", "60611" },
                    { 4, "2345 Ocean View Road", 4, 5, "Miami", "Beachfront property with private access", new DateTime(2024, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 950000m, "House", 4, 3200, "FL", "Available", "33139" },
                    { 5, "678 Mountain Trail", 3, 4, "Denver", "Mountain retreat with panoramic views", new DateTime(2024, 10, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 725000m, "House", 5, 2800, "CO", "Available", "80202" },
                    { 6, "901 Downtown Plaza", 2, 2, "Seattle", "Modern downtown condo near tech hub", new DateTime(2024, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 580000m, "Condo", 6, 1400, "WA", "Sold", "98101" },
                    { 7, "3456 Suburban Lane", 2, 3, "Austin", "Family-friendly home in great school district", new DateTime(2024, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 495000m, "House", 7, 2000, "TX", "Available", "78701" },
                    { 8, "789 Historic District", 3, 3, "Boston", "Charming historic townhouse fully renovated", new DateTime(2024, 10, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 890000m, "Townhouse", 8, 2200, "MA", "Available", "02101" },
                    { 9, "1122 Desert Vista", 2, 3, "Phoenix", "Desert oasis with pool and landscaping", new DateTime(2024, 10, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 425000m, "House", 9, 1900, "AZ", "Available", "85001" },
                    { 10, "4567 Music Row", 3, 4, "Nashville", "Contemporary home near entertainment district", new DateTime(2024, 9, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 615000m, "House", 10, 2400, "TN", "Pending", "37201" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Realtors",
                keyColumn: "Id",
                keyValue: 10);
        }
    }
}
