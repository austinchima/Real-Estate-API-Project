# Design Document

## Overview

The Real Estate Data API system is a cloud-native, full-stack application built with C# ASP.NET Core for the backend API and React (TypeScript/JavaScript) for the frontend client. The system follows a three-layered architecture pattern with clear separation of concerns, deployed entirely on AWS infrastructure with Google APigee providing API security and access control.

### System Components

1. **Backend API** - ASP.NET Core RESTful API with three-layered architecture
2. **Database** - AWS RDS (PostgreSQL or SQL Server) with Entity Framework Core
3. **API Gateway** - Google APigee for authentication and access control
4. **Frontend Client** - React application for end-user interaction
5. **Container Infrastructure** - Docker, AWS ECR, and AWS ECS Fargate
6. **Static Hosting** - AWS S3 for React application hosting
7. **API Documentation** - Swagger/OpenAPI for interactive documentation

### Technology Stack

**Backend:**

- C# / ASP.NET Core 6.0+
- Entity Framework Core
- AutoMapper
- Swashbuckle (Swagger)
- Docker

**Frontend:**

- React 18+
- TypeScript or JavaScript
- Axios for HTTP requests
- React Router for navigation

**Cloud Infrastructure:**

- AWS RDS (Database)
- AWS ECR (Container Registry)
- AWS ECS Fargate (Container Hosting)
- AWS S3 (Static Website Hosting)
- Google APigee (API Gateway)

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────┐
│   End Users     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│     React Web Client (AWS S3)           │
│  - Components for CRUD operations       │
│  - Axios HTTP client with API key       │
└────────┬────────────────────────────────┘
         │ HTTPS + API Key
         ▼
┌─────────────────────────────────────────┐
│     Google APigee API Gateway           │
│  - Verify API Key policy                │
│  - Developer portal                     │
│  - API Product management               │
└────────┬────────────────────────────────┘
         │ Authenticated requests
         ▼
┌─────────────────────────────────────────┐
│   ASP.NET Core API (AWS ECS Fargate)    │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Controller Layer              │ │
│  │  - PropertiesController           │ │
│  │  - UsersController                │ │
│  │  - RealtorsController             │ │
│  │  - Swagger UI endpoint            │ │
│  └──────────┬────────────────────────┘ │
│             │                           │
│  ┌──────────▼────────────────────────┐ │
│  │     Service Layer                 │ │
│  │  - PropertyService                │ │
│  │  - UserService                    │ │
│  │  - RealtorService                 │ │
│  │  - Business logic & validation    │ │
│  └──────────┬────────────────────────┘ │
│             │                           │
│  ┌──────────▼────────────────────────┐ │
│  │     Repository Layer              │ │
│  │  - IPropertyRepository            │ │
│  │  - IUserRepository                │ │
│  │  - IRealtorRepository             │ │
│  │  - Entity Framework DbContext     │ │
│  └──────────┬────────────────────────┘ │
└─────────────┼─────────────────────────┘
              │
              ▼
     ┌────────────────────┐
     │   AWS RDS          │
     │  - Properties      │
     │  - Users           │
     │  - Realtors        │
     └────────────────────┘
```

### Three-Layered Architecture

**Controller Layer:**

- Handles HTTP requests and responses
- Performs input validation
- Maps DTOs to/from service layer
- Returns appropriate HTTP status codes
- Annotated with Swagger attributes for documentation

**Service Layer:**

- Contains business logic
- Orchestrates operations between controllers and repositories
- Performs data validation and transformation
- Uses AutoMapper for entity-DTO mapping
- Implements transaction management

**Repository Layer:**

- Implements Repository Pattern
- Abstracts data access logic
- Uses Entity Framework Core for database operations
- Provides CRUD operations for each entity
- Handles database connection and query execution

## Components and Interfaces

### Data Models

#### Property Entity

```csharp
public class Property
{
    public int Id { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public decimal Price { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int SquareFeet { get; set; }
    public string PropertyType { get; set; } // House, Condo, Apartment, etc.
    public string Status { get; set; } // Available, Sold, Pending
    public int? RealtorId { get; set; }
    public Realtor Realtor { get; set; }
    public DateTime ListedDate { get; set; }
    public string Description { get; set; }
}
```

#### User Entity

```csharp
public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}
```

#### Realtor Entity

```csharp
public class Realtor
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string LicenseNumber { get; set; }
    public string Agency { get; set; }
    public int YearsOfExperience { get; set; }
    public string Specialization { get; set; }
    public bool IsActive { get; set; }
    public ICollection<Property> Properties { get; set; }
}
```

### DTOs (Data Transfer Objects)

Each entity will have at least 3 DTOs:

**Property DTOs:**

1. `PropertyReadDto` - For GET operations (includes all fields)
2. `PropertyCreateDto` - For POST operations (excludes Id, includes validation)
3. `PropertyUpdateDto` - For PUT/PATCH operations (includes Id, all updatable fields)

**User DTOs:**

1. `UserReadDto` - For GET operations
2. `UserCreateDto` - For POST operations
3. `UserUpdateDto` - For PUT/PATCH operations

**Realtor DTOs:**

1. `RealtorReadDto` - For GET operations (includes property count)
2. `RealtorCreateDto` - For POST operations
3. `RealtorUpdateDto` - For PUT/PATCH operations

### Repository Interfaces

```csharp
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(int id);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

public interface IPropertyRepository : IRepository<Property>
{
    Task<IEnumerable<Property>> GetByPropertyTypeAsync(string propertyType);
    Task<IEnumerable<Property>> GetByRealtorIdAsync(int realtorId);
}

public interface IUserRepository : IRepository<User>
{
    Task<User> GetByEmailAsync(string email);
}

public interface IRealtorRepository : IRepository<Realtor>
{
    Task<IEnumerable<Realtor>> GetByAgencyAsync(string agency);
    Task<Realtor> GetWithPropertiesAsync(int id);
}
```

### Service Interfaces

```csharp
public interface IPropertyService
{
    Task<IEnumerable<PropertyReadDto>> GetAllPropertiesAsync();
    Task<PropertyReadDto> GetPropertyByIdAsync(int id);
    Task<PropertyReadDto> CreatePropertyAsync(PropertyCreateDto propertyDto);
    Task<PropertyReadDto> UpdatePropertyAsync(int id, PropertyUpdateDto propertyDto);
    Task<PropertyReadDto> PatchPropertyAsync(int id, JsonPatchDocument<PropertyUpdateDto> patchDoc);
    Task<bool> DeletePropertyAsync(int id);
}

public interface IUserService
{
    Task<IEnumerable<UserReadDto>> GetAllUsersAsync();
    Task<UserReadDto> GetUserByIdAsync(int id);
    Task<UserReadDto> CreateUserAsync(UserCreateDto userDto);
    Task<UserReadDto> UpdateUserAsync(int id, UserUpdateDto userDto);
    Task<UserReadDto> PatchUserAsync(int id, JsonPatchDocument<UserUpdateDto> patchDoc);
    Task<bool> DeleteUserAsync(int id);
}

public interface IRealtorService
{
    Task<IEnumerable<RealtorReadDto>> GetAllRealtorsAsync();
    Task<RealtorReadDto> GetRealtorByIdAsync(int id);
    Task<RealtorReadDto> CreateRealtorAsync(RealtorCreateDto realtorDto);
    Task<RealtorReadDto> UpdateRealtorAsync(int id, RealtorUpdateDto realtorDto);
    Task<RealtorReadDto> PatchRealtorAsync(int id, JsonPatchDocument<RealtorUpdateDto> patchDoc);
    Task<bool> DeleteRealtorAsync(int id);
}
```

### Controller Endpoints

**PropertiesController:**

- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Update entire property
- `PATCH /api/properties/{id}` - Partially update property
- `DELETE /api/properties/{id}` - Delete property

**UsersController:**

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update entire user
- `PATCH /api/users/{id}` - Partially update user
- `DELETE /api/users/{id}` - Delete user

**RealtorsController:**

- `GET /api/realtors` - Get all realtors
- `GET /api/realtors/{id}` - Get realtor by ID
- `POST /api/realtors` - Create new realtor
- `PUT /api/realtors/{id}` - Update entire realtor
- `PATCH /api/realtors/{id}` - Partially update realtor
- `DELETE /api/realtors/{id}` - Delete realtor

## Data Models

### Database Schema

```sql
-- Properties Table
CREATE TABLE Properties (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Address NVARCHAR(200) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(50) NOT NULL,
    ZipCode NVARCHAR(10) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Bedrooms INT NOT NULL,
    Bathrooms INT NOT NULL,
    SquareFeet INT NOT NULL,
    PropertyType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    RealtorId INT NULL,
    ListedDate DATETIME NOT NULL,
    Description NVARCHAR(MAX),
    FOREIGN KEY (RealtorId) REFERENCES Realtors(Id)
);

-- Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedDate DATETIME NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Realtors Table
CREATE TABLE Realtors (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NOT NULL,
    LicenseNumber NVARCHAR(50) NOT NULL UNIQUE,
    Agency NVARCHAR(200) NOT NULL,
    YearsOfExperience INT NOT NULL,
    Specialization NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1
);
```

### Entity Framework DbContext

```csharp
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
        modelBuilder.Entity<Property>()
            .HasOne(p => p.Realtor)
            .WithMany(r => r.Properties)
            .HasForeignKey(p => p.RealtorId)
            .OnDelete(DeleteBehavior.SetNull);

        // Seed data will be added here (10+ rows per table)
        
        base.OnModelCreating(modelBuilder);
    }
}
```

### AutoMapper Profiles

```csharp
public class PropertyProfile : Profile
{
    public PropertyProfile()
    {
        CreateMap<Property, PropertyReadDto>();
        CreateMap<PropertyCreateDto, Property>();
        CreateMap<PropertyUpdateDto, Property>();
        CreateMap<Property, PropertyUpdateDto>();
    }
}

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserReadDto>();
        CreateMap<UserCreateDto, User>();
        CreateMap<UserUpdateDto, User>();
        CreateMap<User, UserUpdateDto>();
    }
}

public class RealtorProfile : Profile
{
    public RealtorProfile()
    {
        CreateMap<Realtor, RealtorReadDto>();
        CreateMap<RealtorCreateDto, Realtor>();
        CreateMap<RealtorUpdateDto, Realtor>();
        CreateMap<Realtor, RealtorUpdateDto>();
    }
}
```

## Error Handling

### Exception Handling Strategy

**Global Exception Handler:**

```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var problemDetails = new ProblemDetails();

        switch (exception)
        {
            case NotFoundException:
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Title = "Resource Not Found";
                break;
            case ValidationException:
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Title = "Validation Error";
                break;
            case DbUpdateException:
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Title = "Database Error";
                break;
            default:
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Title = "Internal Server Error";
                break;
        }

        problemDetails.Detail = exception.Message;
        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        
        return true;
    }
}
```

### HTTP Status Codes

- **200 OK** - Successful GET, PUT, PATCH operations
- **201 Created** - Successful POST operation
- **204 No Content** - Successful DELETE operation
- **400 Bad Request** - Invalid input data or validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Unexpected server errors

### Validation

**Model Validation:**

- Use Data Annotations on DTOs
- FluentValidation for complex validation rules
- Validate in controller before passing to service layer

**Example DTO Validation:**

```csharp
public class PropertyCreateDto
{
    [Required]
    [StringLength(200)]
    public string Address { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, 100)]
    public int Bedrooms { get; set; }

    // Additional validation attributes...
}
```

## Testing Strategy

### Unit Testing

**Test Coverage:**

- Repository layer methods
- Service layer business logic
- AutoMapper profile configurations
- Validation logic

**Testing Framework:**

- xUnit for test framework
- Moq for mocking dependencies
- FluentAssertions for readable assertions

**Example Test Structure:**

```csharp
public class PropertyServiceTests
{
    private readonly Mock<IPropertyRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;
    private readonly PropertyService _service;

    public PropertyServiceTests()
    {
        _mockRepo = new Mock<IPropertyRepository>();
        _mockMapper = new Mock<IMapper>();
        _service = new PropertyService(_mockRepo.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllPropertiesAsync_ReturnsAllProperties()
    {
        // Arrange
        var properties = new List<Property> { /* test data */ };
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(properties);

        // Act
        var result = await _service.GetAllPropertiesAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(properties.Count);
    }
}
```

### Integration Testing

**Test Scenarios:**

- End-to-end API endpoint testing
- Database operations with test database
- HTTP method functionality (GET, POST, PUT, PATCH, DELETE)
- Error handling and validation

**Testing Tools:**

- WebApplicationFactory for in-memory API testing
- Test database (SQLite in-memory or TestContainers)

### Manual Testing

**Swagger UI Testing:**

- Test all endpoints through Swagger interface
- Verify request/response schemas
- Test error scenarios

**Postman/Thunder Client:**

- Create collection for all endpoints
- Test with various input scenarios
- Verify APigee authentication flow

## Deployment Architecture

### Docker Configuration

**Dockerfile:**

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RealEstateAPI/RealEstateAPI.csproj", "RealEstateAPI/"]
RUN dotnet restore "RealEstateAPI/RealEstateAPI.csproj"
COPY . .
WORKDIR "/src/RealEstateAPI"
RUN dotnet build "RealEstateAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RealEstateAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RealEstateAPI.dll"]
```

### AWS Infrastructure

**AWS RDS Setup:**

- Database engine: PostgreSQL or SQL Server
- Instance type: db.t3.micro (Free Tier eligible)
- Storage: 20 GB SSD
- Public accessibility: Yes (for development)
- Security group: Allow inbound on port 5432/1433

**AWS ECR:**

- Repository name: real-estate-api
- Image tag strategy: Use semantic versioning or commit SHA

**AWS ECS Fargate:**

- Cluster name: real-estate-cluster
- Task definition:
  - CPU: 0.25 vCPU
  - Memory: 0.5 GB
  - Container port: 80
  - Environment variables: Database connection string
- Networking: Public subnet with auto-assign public IP
- Security group: Allow inbound HTTP/HTTPS

**AWS S3 Static Website:**

- Bucket name: real-estate-web-client
- Static website hosting enabled
- Index document: index.html
- Bucket policy: Public read access
- CORS configuration for API calls

### APigee Configuration

**API Proxy Setup:**

1. Create API proxy pointing to ECS Fargate endpoint
2. Configure target endpoint with API base URL
3. Add "Verify API Key" policy to proxy endpoint
4. Create API Product with all endpoints
5. Register 2 developers
6. Generate API keys for developers
7. Create developer portal

**Security Policy:**

```xml
<VerifyAPIKey name="verify-api-key">
    <APIKey ref="request.header.x-api-key"/>
</VerifyAPIKey>
```

### React Application Configuration

**Environment Variables:**

```
REACT_APP_API_BASE_URL=https://apigee-proxy-url.com/api
REACT_APP_API_KEY=your-api-key-here
```

**Axios Configuration:**

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_API_KEY
  }
});

export default apiClient;
```

**Build and Deploy:**

```bash
npm run build
aws s3 sync build/ s3://real-estate-web-client --delete
```

## Swagger/OpenAPI Configuration

### Swagger Setup

**Program.cs Configuration:**

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Real Estate API",
        Version = "v1",
        Description = "RESTful API for managing real estate properties, users, and realtors",
        Contact = new OpenApiContact
        {
            Name = "Development Team",
            Email = "team@realestate.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API v1");
    options.RoutePrefix = "swagger";
});
```

**Controller Documentation:**

```csharp
/// <summary>
/// Manages property-related operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PropertiesController : ControllerBase
{
    /// <summary>
    /// Retrieves all properties
    /// </summary>
    /// <returns>List of all properties</returns>
    /// <response code="200">Returns the list of properties</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PropertyReadDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PropertyReadDto>>> GetAllProperties()
    {
        // Implementation
    }
}
```

## Frontend Design

### React Component Structure

```
src/
├── components/
│   ├── properties/
│   │   ├── PropertyList.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── PropertyForm.tsx
│   │   └── PropertyCard.tsx
│   ├── users/
│   │   ├── UserList.tsx
│   │   ├── UserDetail.tsx
│   │   └── UserForm.tsx
│   ├── realtors/
│   │   ├── RealtorList.tsx
│   │   ├── RealtorDetail.tsx
│   │   └── RealtorForm.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── ErrorBoundary.tsx
├── services/
│   ├── propertyService.ts
│   ├── userService.ts
│   └── realtorService.ts
├── hooks/
│   ├── useProperties.ts
│   ├── useUsers.ts
│   └── useRealtors.ts
├── types/
│   ├── property.types.ts
│   ├── user.types.ts
│   └── realtor.types.ts
├── utils/
│   └── apiClient.ts
└── App.tsx
```

### Service Layer Example

```typescript
// propertyService.ts
import apiClient from '../utils/apiClient';
import { Property, PropertyCreate, PropertyUpdate } from '../types/property.types';

export const propertyService = {
  getAll: async (): Promise<Property[]> => {
    const response = await apiClient.get('/properties');
    return response.data;
  },

  getById: async (id: number): Promise<Property> => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  create: async (property: PropertyCreate): Promise<Property> => {
    const response = await apiClient.post('/properties', property);
    return response.data;
  },

  update: async (id: number, property: PropertyUpdate): Promise<Property> => {
    const response = await apiClient.put(`/properties/${id}`, property);
    return response.data;
  },

  patch: async (id: number, updates: Partial<PropertyUpdate>): Promise<Property> => {
    const response = await apiClient.patch(`/properties/${id}`, updates);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  }
};
```

### UI/UX Considerations

- Responsive design for mobile and desktop
- Loading states for async operations
- Error messages for failed operations
- Success notifications for completed actions
- Form validation with user feedback
- Confirmation dialogs for delete operations
- Search and filter functionality for lists

## Security Considerations

### API Security

1. **APigee API Key Authentication** - All requests must include valid API key
2. **HTTPS Only** - All communication over TLS
3. **Input Validation** - Validate all input data
4. **SQL Injection Prevention** - Use parameterized queries (EF Core handles this)
5. **CORS Configuration** - Restrict origins to known domains

### Database Security

1. **Connection String Security** - Store in AWS Secrets Manager or environment variables
2. **Least Privilege** - Database user with minimal required permissions
3. **Encrypted Connections** - Use SSL for database connections

### Frontend Security

1. **API Key Protection** - Store in environment variables, not in code
2. **XSS Prevention** - React handles this by default
3. **HTTPS** - Serve application over HTTPS
4. **Content Security Policy** - Configure CSP headers

## Performance Considerations

### API Performance

1. **Async/Await** - All I/O operations are asynchronous
2. **Database Indexing** - Index frequently queried columns
3. **Pagination** - Implement pagination for large result sets (future enhancement)
4. **Caching** - Consider response caching for read-heavy endpoints (future enhancement)

### Frontend Performance

1. **Code Splitting** - Lazy load routes and components
2. **Memoization** - Use React.memo for expensive components
3. **Debouncing** - Debounce search inputs
4. **Optimistic Updates** - Update UI before API confirmation

## Monitoring and Logging

### API Logging

- Use Serilog or built-in ILogger
- Log levels: Information, Warning, Error
- Log to console and file
- Include request/response details for debugging

### APigee Analytics

- Monitor API usage
- Track error rates
- Analyze response times
- Monitor API key usage

### AWS CloudWatch

- Monitor ECS task health
- Track container logs
- Set up alarms for errors
- Monitor RDS performance metrics
