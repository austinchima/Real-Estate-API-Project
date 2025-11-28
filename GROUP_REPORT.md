# Real Estate Data API and Web Application

## Group Project Report

---

### Course Information

**Course Code:** [COURSE CODE]  
**Project Title:** Real Estate Data API and Search Web Application  
**Submission Date:** Week 11  

### Group Members

- **[MEMBER 1 NAME]** - Backend Core & Data Layer
- **[MEMBER 2 NAME]** - Backend API & Cloud Deployment
- **[MEMBER 3 NAME]** - API Management & Frontend Client

---

## Executive Summary

This report documents the development and deployment of a full-stack cloud-native Real Estate Data API and Web Application. The project demonstrates core competencies in RESTful API development using C# ASP.NET Core, React frontend development, and comprehensive AWS cloud deployment. The system implements a three-layered architecture with the Repository Pattern, managing three core entities: Properties, Users, and Realtors. All components are deployed on AWS infrastructure (RDS, ECS Fargate, S3) with API security managed through Google APigee.

---

## 1. Project Overview & Architecture

### 1.1 System Architecture

The Real Estate Data API follows a modern cloud-native architecture designed for scalability, maintainability, and security. The system comprises three primary layers:

**Presentation Layer:**

- React 19.2.0 web application with TypeScript
- Hosted on AWS S3 with static website hosting
- Responsive UI for managing properties, users, and realtors
- Client-side routing with React Router DOM

**API Layer:**

- ASP.NET Core 8.0 RESTful API
- Containerized with Docker and deployed on AWS ECS Fargate
- Swagger/OpenAPI documentation for API exploration
- Global error handling and validation middleware

**Data Layer:**

- AWS RDS SQL Server database
- Entity Framework Core 8.0.11 for ORM
- Repository Pattern for clean data access abstraction
- AutoMapper for DTO-to-entity mapping

### 1.2 System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│                         End Users                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Web Application                         │
│                    (AWS S3 Static Hosting)                       │
│  - Property Management UI    - User Management UI                │
│  - Realtor Management UI     - TypeScript Types                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + API Key
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google APigee Gateway                         │
│  - API Key Verification      - Rate Limiting                     │
│  - Developer Portal          - API Product Management            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              ASP.NET Core API (AWS ECS Fargate)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                             │  │
│  │  PropertiesController | UsersController | RealtorsController│ │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │              Services Layer (Business Logic)              │  │
│  │  PropertyService | UserService | RealtorService           │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │         Repository Layer (Data Access)                    │  │
│  │  IRepository<T> | PropertyRepository | UserRepository     │  │
│  │  RealtorRepository | Entity Framework Core                │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS RDS SQL Server                            │
│  - Properties Table (10+ rows)                                   │
│  - Users Table (10+ rows)                                        │
│  - Realtors Table (10+ rows)                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Figure 1:** System Architecture Diagram showing the complete data flow from end users through the React application, APigee gateway, containerized API, and AWS RDS database.

### 1.3 Technology Stack

**Backend Technologies:**

- ASP.NET Core 8.0 with C# (nullable reference types enabled)
- Entity Framework Core 8.0.11 for database operations
- AutoMapper 12.0.1 for object-to-object mapping
- Swashbuckle.AspNetCore 7.2.0 for API documentation
- Microsoft.AspNetCore.JsonPatch 8.0.11 for PATCH operations

**Frontend Technologies:**

- React 19.2.0 with TypeScript 5.9.3
- Vite 7.2.2 as build tool and development server
- Axios 1.13.2 for HTTP client operations
- React Router DOM 7.9.6 for client-side routing

**Cloud Infrastructure:**

- AWS RDS (SQL Server) for managed database
- AWS ECR for Docker container registry
- AWS ECS Fargate for serverless container hosting
- AWS S3 for static website hosting
- AWS IAM for access management
- Google APigee for API gateway and security

**Development Tools:**

- Docker for containerization
- Git/GitHub for version control
- Visual Studio for backend development
- ESLint for code quality

### 1.4 API Design Principles

The API follows RESTful design principles with:

- Resource-based URLs (`/api/properties`, `/api/users`, `/api/realtors`)
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Proper HTTP status codes (200, 201, 204, 400, 404, 500)
- JSON request/response format
- DTO pattern for API contracts
- Comprehensive error handling with structured error responses

---

## 2. Data Structure & Implementation

### 2.1 Entity-Relationship Model

tities with the following relationships:

**Property Entity:**

- PropertyId (Primary Key)
- Address, City, State, ZipCode
- Price, Bedrooms, Bathrooms, SquareFeet
- PropertyType, Status
- RealtorId (Foreign Key to Realtor)

**User Entity:**

- UserId (Primary Key)
- FirstName, LastName, Email
- PhoneNumber, DateRegistered
- IsActive
Entity:**
- RealtorId (Primary Key)
- FirstName, LastName, Email
- PhoneNumber, LicenseNumber
- YearsOfExperience, Specialization
- IsActive
- Properties (Navigation Property - One-to-Many)

**Relationships:**

- One Realtor can manage many Properties (1:N)
- Users are independent entities (no direct relationships in MVP)

**Re
The system manages th

### 2.2 Database Schema Implementation

```sql
-- Sample SQL Script for Database Schema

-- Create Realtors Table
CREATE TABLE Realtors (
    RealtorId INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NOT NULL,
    LicenseNumber NVARCHAR(50) NOT NULL UNIQUE,
    YearsOfExperience INT NOT NULL,
    Specialization NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT CK_Realtors_YearsOfExperience CHECK (YearsOfExperience >= 0)
);

-- Create Propertirties (
    PropertyId INT PRIMARY KEY IDENTITY(1,1),
    Address NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(50) NOT NULL,
    ZipCode NVARCHAR(10) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Bedrooms INT NOT NULL,
    Bathrooms INT NOT NULL,
    SquareFeet INT NOT NULL,
    PropertyType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    RealtorId INT NOT NULL,
    CONSTRAINT FK_Properties_Realtors FOREIGN KEY (RealtorId) 
        REFERENCES Realtors(RealtorId) ON DELETE CASCADE,
    CONSTRAINT CK_Properties_Price CHECK (Price > 0),
    CONSTRAINT CK_Properties_Bedrooms CHECK (Bedrooms >= 0),
    CONSTRAINT CK_Properties_Bathrooms CHECK (Bathrooms >= 0),
    CONSTRAINT CK_Properties_SquareFeet CHECK (SquareFeet > 0)
);

-- Create Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NOT NULL,
    DateRegistered DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Create Indexes for Performance
CREATE INDEX IX_Properties_RealtorId ON Properties(RealtorId);
CREATE INDEX IX_Properties_City ON Properties(City);
CREATE INDEX IX_Properties_Status ON Properties(Status);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Realtors_Email ON Realtors(Email);

-- Sample Seed Data for Realtors
INSERT INTO Realtors (FirstName, LastName, Emailes Table
CREATE TANumber, LicenseNumber, 
                      YearsOfExperience, Specialization, IsActive)
VALUES 
    ('John', 'Smith', 'john.smith@realestate.com', '555-0101', 'RE-2018-001', 
     7, 'Residential', 1),
    ('Sarah', 'Johnson', 'sarah.j@realestate.com', '555-0102', 'RE-2019-002', 
     5, 'Commercial', 1),
    ('Michael', 'Brown', 'mbrown@realestate.com', '555-0103', 'RE-2020-003', 
     3, 'Luxury Homes', 1);

-- Sample Seed Data for Properties
INSERT INTO Properties (Address, City, State, ZipCode, Price, Bedrooms, 
                        Bathrooms, SquareFeet, PropertyType, Status, RealtorId)
VALUES 
    ('123 Main St', 'Springfield', 'IL', '62701', 250000.00, 3, 2, 1800, 
     'Single Family', 'Available', 1),
    ('456 Oak Ave', 'Springfield', 'IL', '62702', 350000.00, 4, 3, 2400, 
     'Single Family', 'Available', 1),
    ('789 Commerce Blvd', 'Chicago', 'IL', '60601', 000.00, 0, 4, 5000, 
     'Commercial', 'Ava2);

-- Sample Seed Data for Users
INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, DateRegistered, IsActive)
VALUES 
    ('Alice', 'Williams', 'alice.w@email.com', '555-1001', GETDATE(), 1),
    ('Bob', 'Davis', 'bob.davis@email.com', '555-1002', GETDATE(), 1),
    ('Carol', 'Martinez', 'carol.m@email.com', '555-1003', GETDATE(), 1);
```

**Figure 2:** Complete database schema with constraints, indexes, and sample seed data demonstrating the relational structure.

### 2.3 Repository Pattern Implementation

The project implements a generic repository pattern for clean separation of data access logic:

```csharp
// Generic Repository Interface
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

// Property-Specific Repository Interface
public interface IPropertyRepository : IRepository<Property>
{
    Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId);
    Task<IEnumerable<Property>> GetPropertiesByCityAsync(string city);
    Task<IEnumerable<Property>> GetPropertiesByStatusAsync(string status);
}

// Property Repository Implementation
public class PropertyRepository : IPropertyRepository
{
    private readonly ApplicationDbContext _context;

    public PropertyRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Property>> GetAllAsync()
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .ToListAsync();
    }

    public async Task<Property?> GetByIdAsync(int id)
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .FirstOrDefaultAsync(p => p.PropertyId == id);
    }

    public async Task<Property> AddAsync(Property entity)
    {
        _context.Properties.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Property entity)
    {
        _context.Properties.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var property = await GetByIdAsync(id);
        if (property != null)
        {
            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Properties.AnyAsync(p => p.PropertyId == id);
    }

    public async Task<IEnumerable<Property>> GetPropertiesByRealtorAsync(int realtorId)
    {
        return await _context.Properties
            .Include(p => p.Realtor)
            .Where(p => p.RealtorId == realtorId)
            .ToListAsync();
    }
}
```

**Benefits of Repository Pattern:**

- Abstraction of data access logic from business logic
- Easier unit testing through interface mocking
- Centralized data access code
- Flexibility to change data sources without affecting business logic
- Consistent data access patterns across the application

### 2.4 DTO Implementation with AutoMapper

The API uses Data Transfer Objects (DTOs) to decouple the API contract from internal entity models:

```csharp
// Property DTOs
public class PropertyReadDto
{
    public int PropertyId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int RealtorId { get; set; }
    public string? RealtorName { get; set; }
}

public class PropertyCreateDto
{
    [Required]
    [StringLength(255)]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    [Range(0, 100)]
    public int Bedrooms { get; set; }
    
    [Required]
    public int RealtorId { get; set; }
}

public class PropertyUpdateDto
{
    [StringLength(255)]
    public string? Address { get; set; }
    
    [Range(0.01, double.MaxValue)]
    public decimal? Price { get; set; }
    
    public string? Status { get; set; }
}

// AutoMapper Profile Configuration
public class PropertyProfile : Profile
{
    public PropertyProfile()
    {
        // Entity to ReadDto
        CreateMap<Property, PropertyReadDto>()
            .ForMember(dest => dest.RealtorName, 
                opt => opt.MapFrom(src => 
                    src.Realtor != null 
                        ? $"{src.Realtor.FirstName} {src.Realtor.LastName}" 
                        : null));

        // CreateDto to Entity
        CreateMap<PropertyCreateDto, Property>();

        // UpdateDto to Entity (ignore null values)
        CreateMap<PropertyUpdateDto, Property>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => 
                srcMember != null));
    }
}
```

**DTO Benefits:**

- API versioning flexibility without changing database schema
- Security through selective property exposure
- Validation at the API boundary
- Reduced payload size by excluding unnecessary data
- Clear API contracts for consumers

### 2.5 RESTful API Endpoints

The API implements all six HTTP methods for each of the three controllers:

**Properties Controller (`/api/properties`):**

- `GET /api/properties` - Retrieve all properties
- `GET /api/properties/{id}` - Retrieve specific property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Replace entire property record
- `PATCH /api/properties/{id}` - Partially update property
- `DELETE /api/properties/{id}` - Remove property

**Users Controller (`/api/users`):**

- `GET /api/users` - Retrieve all users
- `GET /api/users/{id}` - Retrieve specific user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Replace entire user record
- `PATCH /api/users/{id}` - Partially update user
- `DELETE /api/users/{id}` - Remove user

**Realtors Controller (`/api/realtors`):**

- `GET /api/realtors` - Retrieve all realtors
- `GET /api/realtors/{id}` - Retrieve specific realtor by ID
- `POST /api/realtors` - Create new realtor
- `PUT /api/realtors/{id}` - Replace entire realtor record
- `PATCH /api/realtors/{id}` - Partially update realtor
- `DELETE /api/realtors/{id}` - Remove realtor

**Total Endpoints:** 18 (6 methods × 3 controllers)

### 2.6 Controller Implementation Example

```csharp
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _repository;
    private readonly IMapper _mapper;

    public PropertiesController(IPropertyRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    // GET: api/properties
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyReadDto>>> GetAllProperties()
    {
        var properties = await _repository.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<PropertyReadDto>>(properties));
    }

    // GET: api/properties/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyReadDto>> GetProperty(int id)
    {
        var property = await _repository.GetByIdAsync(id);
        if (property == null)
            return NotFound(new { message = $"Property with ID {id} not found" });

        return Ok(_mapper.Map<PropertyReadDto>(property));
    }

    // POST: api/properties
    [HttpPost]
    public async Task<ActionResult<PropertyReadDto>> CreateProperty(
        PropertyCreateDto propertyDto)
    {
        var property = _mapper.Map<Property>(propertyDto);
        var created = await _repository.AddAsync(property);
        var readDto = _mapper.Map<PropertyReadDto>(created);

        return CreatedAtAction(nameof(GetProperty), 
            new { id = created.PropertyId }, readDto);
    }

    // PUT: api/properties/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProperty(int id, 
        PropertyUpdateDto propertyDto)
    {
        if (!await _repository.ExistsAsync(id))
            return NotFound();

        var property = await _repository.GetByIdAsync(id);
        _mapper.Map(propertyDto, property);
        await _repository.UpdateAsync(property);

        return NoContent();
    }

    // PATCH: api/properties/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchProperty(int id, 
        [FromBody] JsonPatchDocument<PropertyUpdateDto> patchDoc)
    {
        if (!await _repository.ExistsAsync(id))
            return NotFound();

        var property = await _repository.GetByIdAsync(id);
        var propertyToPatch = _mapper.Map<PropertyUpdateDto>(property);
        
        patchDoc.ApplyTo(propertyToPatch, ModelState);
        
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _mapper.Map(propertyToPatch, property);
        await _repository.UpdateAsync(property);

        return NoContent();
    }

    // DELETE: api/properties/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        if (!await _repository.ExistsAsync(id))
            return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
```

---

## 3. Cloud Deployment Architecture

### 3.1 AWS Infrastructure Overview

The application is deployed across multiple AWS services for scalability, reliability, and security:

**Database Tier (AWS RDS):**

- Managed SQL Server instance
- Automated backups and maintenance
- Multi-AZ deployment option for high availability
- Security groups for network isolation
- Connection string stored in environment variables

**Application Tier (AWS ECS Fargate):**

- Serverless container orchestration
- Docker image stored in AWS ECR
- Task definition with resource allocation (CPU, memory)
- Environment variables for configuration
- CloudWatch integration for logging

**Presentation Tier (AWS S3):**

- Static website hosting for React application
- Public read access with bucket policy
- CORS configuration for API communication
- CloudFront CDN option for global distribution

**API Gateway (Google APigee):**

- API proxy for security and management
- API key verification policy
- Rate limiting and quota management
- Developer portal for API consumers
- Analytics and monitoring

### 3.2 Containerization with Docker

```dockerfile
# Dockerfile for ASP.NET Core API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RealEstateAPI.csproj", "./"]
RUN dotnet restore "RealEstateAPI.csproj"
COPY . .
RUN dotnet build "RealEstateAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RealEstateAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RealEstateAPI.dll"]
```

**Docker Build and Push Process:**

```powershell
# Build Docker image
docker build -t realestate-api:latest .

# Tag for ECR
docker tag realestate-api:latest [AWS_ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/realestate-api:latest

# Authenticate with ECR
aws ecr get-login-password --region [REGION] | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com

# Push to ECR
docker push [AWS_ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/realestate-api:latest
```

### 3.3 ECS Task Definition

```json
{
  "family": "realestate-api-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "realestate-api",
      "image": "[AWS_ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/realestate-api:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "ConnectionStrings__DefaultConnection",
          "value": "Server=[RDS_ENDPOINT];Database=RealEstateDB;User Id=[USERNAME];Password=[PASSWORD];TrustServerCertificate=True;"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/realestate-api",
          "awslogs-region": "[REGION]",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3.4 APigee Configuration

**API Proxy Setup:**

- Target endpoint: ECS Fargate public IP
- Base path: `/api`
- Verify API Key policy in request flow
- CORS policy for browser access

**API Product Configuration:**

- Product name: Real Estate API
- Environments: Production
- Operations: All endpoints (GET, POST, PUT, PATCH, DELETE)
- Quota: 1000 requests per hour

**Developer Portal:**

- Self-service API key generation
- Interactive API documentation
- Code samples for common languages
- Two registered developers for testing

### 3.5 React Application Deployment to S3

```bash
# Build React application for production
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://realestate-client-bucket --delete

# Configure bucket for static website hosting
aws s3 website s3://realestate-client-bucket --index-document index.html --error-document index.html

# Set bucket policy for public read access
aws s3api put-bucket-policy --bucket realestate-client-bucket --policy file://bucket-policy.json
```

**Bucket Policy for Public Access:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::realestate-client-bucket/*"
    }
  ]
}
```

---

## 4. Frontend Implementation

### 4.1 React Application Architecture

The React application follows a component-based architecture with clear separation of concerns:

**Service Layer (`src/services/`):**

- `apiClient.ts` - Axios configuration with API key injection
- `propertyService.ts` - Property CRUD operations
- `userService.ts` - User CRUD operations
- `realtorService.ts` - Realtor CRUD operations

**Component Structure:**

- List components for displaying collections
- Detail components for viewing individual records
- Form components for create/edit operations
- Navigation component for routing

**Type Safety:**

- TypeScript interfaces for all entities
- Type-safe API responses
- Compile-time error checking

### 4.2 API Client Configuration

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY
  }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4.3 Service Layer Implementation

```typescript
// src/services/propertyService.ts
import apiClient from './apiClient';
import { Property, PropertyCreate, PropertyUpdate } from '../types';

export const propertyService = {
  // GET all properties
  getAll: async (): Promise<Property[]> => {
    const response = await apiClient.get('/properties');
    return response.data;
  },

  // GET property by ID
  getById: async (id: number): Promise<Property> => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  // POST create property
  create: async (property: PropertyCreate): Promise<Property> => {
    const response = await apiClient.post('/properties', property);
    return response.data;
  },

  // PUT update property
  update: async (id: number, property: PropertyUpdate): Promise<void> => {
    await apiClient.put(`/properties/${id}`, property);
  },

  // PATCH partial update
  patch: async (id: number, updates: Partial<PropertyUpdate>): Promise<void> => {
    await apiClient.patch(`/properties/${id}`, updates);
  },

  // DELETE property
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  }
};
```

### 4.4 Component Example

```typescript
// src/components/PropertyList.tsx
import React, { useEffect, useState } from 'react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types';

export const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.delete(id);
        await loadProperties();
      } catch (err) {
        setError('Failed to delete property');
      }
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="property-list">
      <h2>Properties</h2>
      <div className="property-grid">
        {properties.map(property => (
          <div key={property.propertyId} className="property-card">
            <h3>{property.address}</h3>
            <p>{property.city}, {property.state}</p>
            <p className="price">${property.price.toLocaleString()}</p>
            <p>{property.bedrooms} bed | {property.bathrooms} bath</p>
            <p>Status: {property.status}</p>
            <button onClick={() => handleDelete(property.propertyId)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 5. Testing and Validation

### 5.1 API Testing Results

All 18 endpoints (6 methods × 3 controllers) were tested and validated:

**Properties Controller:**

- ✅ GET /api/properties - Returns all properties with realtor information
- ✅ GET /api/properties/{id} - Returns specific property or 404
- ✅ POST /api/properties - Creates new property, returns 201 with location header
- ✅ PUT /api/properties/{id} - Updates entire property, returns 204
- ✅ PATCH /api/properties/{id} - Partially updates property, returns 204
- ✅ DELETE /api/properties/{id} - Removes property, returns 204

**Users Controller:**

- ✅ All 6 HTTP methods implemented and tested
- ✅ Validation working correctly for required fields
- ✅ Email uniqueness constraint enforced

**Realtors Controller:**

- ✅ All 6 HTTP methods implemented and tested
- ✅ License number uniqueness enforced
- ✅ Cascade delete working for associated properties

### 5.2 Integration Testing

**Database Integration:**

- ✅ AWS RDS connection successful from ECS Fargate
- ✅ Entity Framework migrations applied successfully
- ✅ All tables contain 10+ rows of seed data
- ✅ Foreign key relationships working correctly

**APigee Integration:**

- ✅ API proxy routing to ECS endpoint
- ✅ API key verification policy active
- ✅ Unauthorized requests (missing API key) return 401
- ✅ Valid API key requests pass through successfully

**Frontend Integration:**

- ✅ React app successfully calls all 18 endpoints
- ✅ API key included in all requests
- ✅ CORS configuration working correctly
- ✅ Error handling displays user-friendly messages

### 5.3 End-to-End User Flows

**Property Management Flow:**

1. User navigates to React app on S3
2. App loads property list via APigee
3. User creates new property via form
4. POST request through APigee to ECS API
5. API validates and saves to RDS
6. Success response updates UI
7. New property appears in list

**Complete CRUD Cycle:**

- ✅ Create: New records successfully added to database
- ✅ Read: All records retrieved with proper formatting
- ✅ Update: PUT and PATCH operations modify records correctly
- ✅ Delete: Records removed with proper cascade behavior

---

## 6. Project Management and Collaboration

### 6.1 Team Structure and Responsibilities

The project was divided into three major areas of responsibility:

**Member 1 - Backend Core & Data Layer:**

- Database design and Entity Framework configuration
- Repository pattern implementation
- DTO classes and AutoMapper profiles
- AWS RDS deployment and data seeding

**Member 2 - Backend API & Cloud Deployment:**

- Service layer business logic
- Controller implementation with all HTTP methods
- Docker containerization
- AWS ECS Fargate deployment
- Swagger documentation

**Member 3 - API Management & Frontend:**

- Google APigee configuration
- React application development
- TypeScript type definitions
- AWS S3 deployment
- End-to-end testing

### 6.2 Development Workflow

**Version Control:**

- Git repository with feature branch workflow
- Pull requests for code review
- Clear commit messages following conventions

**Integration Points:**

- Weekly team meetings for progress sync
- Shared documentation in repository
- Regular integration testing at component boundaries

**Tools and Communication:**

- GitHub for code repository
- Shared AWS account with IAM roles
- Documentation in Markdown format

---

## 7. Experience(s) Gained & Lessons Learnt

### [MEMBER 1 NAME] - Backend Core & Data Layer

**Responsibilities:**
I was responsible for the database architecture, Entity Framework Core configuration, repository pattern implementation, and DTO design with AutoMapper integration.

**Key Learnings:**

- **Database Design in Cloud Environments:** I gained a deeper understanding of relational database design principles and how they are applied in cloud-native applications. Working with AWS RDS taught me about managed database services, connection string security, and the importance of proper indexing for performance.

- **Repository Pattern Benefits:** Implementing the generic repository pattern demonstrated the value of abstraction in software architecture. This pattern made the codebase more testable and maintainable by separating data access logic from business logic.

- **Entity Framework Core Migrations:** I learned how to manage database schema changes through code-first migrations, coordinate migration deployment with team members, and handle migration conflicts in a collaborative environment.

- **DTO Pattern and AutoMapper:** Understanding the separation between domain entities and API contracts was crucial. AutoMapper simplified the mapping process, but I learned the importance of explicit configuration for complex mappings and the performance implications of automatic mapping.

- **Challenges Overcome:** Initially struggled with Entity Framework relationship configuration, particularly with cascade delete behavior. Through documentation and experimentation, I learned to properly configure foreign key relationships and navigation properties.

---

### [MEMBER 2 NAME] - Backend API & Cloud Deployment

**Responsibilities:**
I was responsible for implementing the service layer, all API controllers with six HTTP methods each, global error handling, Docker containerization, and AWS ECS Fargate deployment.

**Key Learnings:**

- **RESTful API Design:** I gained practical experience in implementing RESTful principles, including proper HTTP method usage, status codes, and resource-based URL design. Understanding when to use PUT vs PATCH was particularly valuable.

- **Containerization with Docker:** Learning Docker fundamentals and creating multi-stage Dockerfiles taught me about container optimization, layer caching, and the benefits of containerized deployments for consistency across environments.

- **AWS ECS Fargate Deployment:** I developed hands-on experience with serverless container orchestration. Understanding task definitions, networking configurations, and environment variable management in ECS was challenging but rewarding.

- **Error Handling and Validation:** Implementing global exception handling middleware taught me the importance of consistent error responses and proper logging for debugging production issues.

- **Swagger/OpenAPI Documentation:** I learned that good API documentation is essential for team collaboration and API consumers. Swagger UI provided an interactive way to test endpoints during development.

- **Challenges Overcome:** Debugging networking issues between ECS and RDS was initially difficult. I learned to use security groups, VPC configuration, and CloudWatch logs effectively to diagnose and resolve connectivity problems.

---

### [MEMBER 3 NAME] - API Management & Frontend Client

**Responsibilities:**
I was responsible for Google APigee configuration, React application development with TypeScript, implementing all CRUD operations in the frontend, and AWS S3 deployment for static hosting.

**Key Learnings:**

- **API Gateway Management:** I gained comprehensive understanding of API management platforms and their role in enterprise architecture. Configuring APigee taught me about API security, rate limiting, developer portals, and the importance of API key management.

- **React with TypeScript:** Working with TypeScript in React applications demonstrated the value of type safety in frontend development. Type checking caught many potential runtime errors during development and improved code maintainability.

- **Asynchronous JavaScript:** Implementing service layers with async/await patterns deepened my understanding of promises, error handling in asynchronous code, and proper state management in React components.

- **CORS and Security:** I learned about Cross-Origin Resource Sharing (CORS) configuration and the security implications of API access from browser-based applications. Understanding preflight requests and proper header configuration was essential.

- **AWS S3 Static Hosting:** Deploying a React application to S3 taught me about static website hosting, bucket policies, and the benefits of separating frontend and backend deployments.

- **Component Architecture:** Designing reusable React components with clear separation of concerns (presentation vs. logic) improved code organization and made the application easier to maintain and extend.

- **Challenges Overcome:** Initially struggled with CORS errors when the React app tried to communicate with the API through APigee. Through systematic debugging and understanding of browser security policies, I learned to properly configure CORS headers and APigee policies.

---

## 8. Conclusion

This project successfully demonstrates a complete full-stack cloud-native application from database to user interface. The Real Estate Data API and Web Application implements industry-standard patterns including the Repository Pattern, DTO-based API contracts, and RESTful design principles.

**Key Achievements:**

- ✅ Complete three-layered architecture with clear separation of concerns
- ✅ 18 fully functional API endpoints (6 methods × 3 controllers)
- ✅ AWS RDS database with proper relational design and 10+ rows per table
- ✅ Docker containerization and AWS ECS Fargate deployment
- ✅ Google APigee API gateway with security policies
- ✅ React web application with TypeScript consuming all endpoints
- ✅ AWS S3 static website hosting
- ✅ Comprehensive documentation and testing

**Technical Skills Demonstrated:**

- Backend development with C# and ASP.NET Core
- Database design and Entity Framework Core
- RESTful API design and implementation
- Frontend development with React and TypeScript
- Cloud infrastructure deployment on AWS
- API management and security with APigee
- Containerization with Docker
- Version control and team collaboration

**Project Impact:**

This MVP successfully demonstrates the core competencies required for modern full-stack development. The modular architecture allows for future enhancements such as authentication, advanced search capabilities, image uploads, and real-time notifications. The cloud-native design ensures scalability and reliability for production use.

The team gained invaluable hands-on experience with industry-standard tools and practices, preparing us for real-world software development challenges. The project serves as a strong foundation for understanding how modern web applications are architected, developed, and deployed in cloud environments.

---

## Appendices

### Appendix A: API Endpoint Reference

Complete list of all 18 implemented endpoints with request/response examples available in Swagger documentation at: `https://[ECS-ENDPOINT]/swagger`

### Appendix B: Database Schema

Complete SQL schema with all tables, relationships, constraints, and indexes documented in Section 2.2.

### Appendix C: Deployment Scripts

PowerShell scripts for automated deployment available in repository:

- `push-to-ecr.ps1` - Docker image build and ECR push
- `launch-ecs-task.ps1` - ECS task deployment
- `push-to-rds.ps1` - Database migration application

### Appendix D: Environment Configuration

Required environment variables for each component:

- Backend: Connection strings, CORS origins
- Frontend: API base URL, API key
- AWS: Account ID, region, resource names

---

**End of Report**
