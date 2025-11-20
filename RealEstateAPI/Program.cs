// Real Estate API - Main application entry point
// Three-layered architecture: Controllers -> Services -> Repositories
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Repositories;
using RealEstateAPI.Services;
using RealEstateAPI.GlobalErrorHandling;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddNewtonsoftJson(); // Required for JsonPatch support

// Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<RealEstateDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories (Data Access Layer)
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRealtorRepository, RealtorRepository>();

// Register Services (Business Logic Layer)
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRealtorService, RealtorService>();

// Configure AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Real Estate API",
        Version = "v1",
        Description = "RESTful API for managing real estate properties, users, and realtors",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Development Team",
            Email = "team@realestate.com"
        }
    });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Configure the HTTP request pipeline
// Global error handling - catches all exceptions and returns consistent JSON responses
app.UseMiddleware<GlobalExceptionMiddleware>();

// Enable Swagger documentation in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API v1");
        options.RoutePrefix = "swagger";
    });
}

// Security and routing middleware
app.UseHttpsRedirection();
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Start the application
app.Run();
