# Implementation Plan

- [x] 1. Set up project structure and core infrastructure

  - Create ASP.NET Core Web API project with proper folder structure (Controllers, Services, Repositories, Models, DTOs)
  - Configure dependency injection in Program.cs

  - Set up Entity Framework Core with DbContext

  - Configure connection strings for local development (SQLite/LocalDB)
  - Install required NuGet packages (EF Core, AutoMapper, Swashbuckle, JsonPatch)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement data models and database configuration
  - [ ] 2.1 Create entity models for Property, User, and Realtor
    - Define Property entity with all required properties and relationships

    - Define User entity with all required properties
    - Define Realtor entity with all required properties and navigation to Properties

    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 2.2 Configure Entity Framework DbContext and relationships
    - Create RealEstateDbContext with DbSet properties

    - Configure entity relationships in OnModelCreating
    - Set up foreign key constraints and cascade behaviors
    - _Requirements: 2.5_

  - [x] 2.3 Create and apply initial database migration

    - Generate EF Core migration for initial schema
    - Apply migration to create local database

    - _Requirements: 2.5_

  - [ ] 2.4 Seed database with sample data
    - Create seed data for at least 10 properties
    - Create seed data for at least 10 users
    - Create seed data for at least 10 realtors
    - Apply seed data through migration or DbContext initialization
    - _Requirements: 2.4, 7.2_

- [ ] 3. Implement DTOs and AutoMapper configuration
  - [ ] 3.1 Create DTO classes for all entities
    - Create PropertyReadDto, PropertyCreateDto, PropertyUpdateDto
    - Create UserReadDto, UserCreateDto, UserUpdateDto
    - Create RealtorReadDto, RealtorCreateDto, RealtorUpdateDto
    - Add data annotations for validation on create/update DTOs
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 3.2 Configure AutoMapper profiles
    - Create PropertyProfile with mappings between Property entity and DTOs
    - Create UserProfile with mappings between User entity and DTOs
    - Create RealtorProfile with mappings between Realtor entity and DTOs
    - Register AutoMapper in dependency injection
    - _Requirements: 3.4, 3.5_

- [ ] 4. Implement Repository Pattern for data access
  - [ ] 4.1 Create repository interfaces
    - Define IRepository\<T\> generic interface with CRUD methods
    - Define IPropertyRepository with additional query methods
    - Define IUserRepository with additional query methods
    - Define IRealtorRepository with additional query methods
    - _Requirements: 1.3_

  - [ ] 4.2 Implement repository classes
    - Implement PropertyRepository with all CRUD operations using EF Core
    - Implement UserRepository with all CRUD operations using EF Core
    - Implement RealtorRepository with all CRUD operations using EF Core
    - Use async/await for all database operations
    - Register repositories in dependency injection
    - _Requirements: 1.3, 1.4, 18.3_

- [ ] 5. Implement Service Layer with business logic
  - [ ] 5.1 Create service interfaces
    - Define IPropertyService with all CRUD method signatures
    - Define IUserService with all CRUD method signatures
    - Define IRealtorService with all CRUD method signatures
    - _Requirements: 1.2_

  - [ ] 5.2 Implement PropertyService
    - Implement GetAllPropertiesAsync using repository and AutoMapper
    - Implement GetPropertyByIdAsync with not found handling
    - Implement CreatePropertyAsync with validation
    - Implement UpdatePropertyAsync (full update)
    - Implement PatchPropertyAsync (partial update with JsonPatchDocument)
    - Implement DeletePropertyAsync with existence check
    - Register service in dependency injection
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 18.3_

  - [ ] 5.3 Implement UserService
    - Implement GetAllUsersAsync using repository and AutoMapper
    - Implement GetUserByIdAsync with not found handling
    - Implement CreateUserAsync with validation
    - Implement UpdateUserAsync (full update)
    - Implement PatchUserAsync (partial update with JsonPatchDocument)
    - Implement DeleteUserAsync with existence check
    - Register service in dependency injection
    - _Requirements: 1.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 18.3_

  - [ ] 5.4 Implement RealtorService
    - Implement GetAllRealtorsAsync using repository and AutoMapper
    - Implement GetRealtorByIdAsync with not found handling
    - Implement CreateRealtorAsync with validation
    - Implement UpdateRealtorAsync (full update)
    - Implement PatchRealtorAsync (partial update with JsonPatchDocument)
    - Implement DeleteRealtorAsync with existence check
    - Register service in dependency injection
    - _Requirements: 1.2, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 18.3_

- [ ] 6. Implement API Controllers with all HTTP methods
  - [ ] 6.1 Implement PropertiesController
    - Create GET /api/properties endpoint (GetAll)
    - Create GET /api/properties/{id} endpoint (GetById)
    - Create POST /api/properties endpoint (Create)
    - Create PUT /api/properties/{id} endpoint (Full Update)
    - Create PATCH /api/properties/{id} endpoint (Partial Update)
    - Create DELETE /api/properties/{id} endpoint (Delete)
    - Add XML documentation comments for Swagger

    - Add proper HTTP status code responses (200, 201, 204, 400, 404)
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 16.1, 16.2, 16.3, 16.4_

  - [ ] 6.2 Implement UsersController
    - Create GET /api/users endpoint (GetAll)
    - Create GET /api/users/{id} endpoint (GetById)
    - Create POST /api/users endpoint (Create)
    - Create PUT /api/users/{id} endpoint (Full Update)
    - Create PATCH /api/users/{id} endpoint (Partial Update)
    - Create DELETE /api/users/{id} endpoint (Delete)
    - Add XML documentation comments for Swagger
    - Add proper HTTP status code responses (200, 201, 204, 400, 404)
    - _Requirements: 1.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 16.1, 16.2, 16.3, 16.4_

  - [ ] 6.3 Implement RealtorsController
    - Create GET /api/realtors endpoint (GetAll)
    - Create GET /api/realtors/{id} endpoint (GetById)
    - Create POST /api/realtors endpoint (Create)
    - Create PUT /api/realtors/{id} endpoint (Full Update)
    - Create PATCH /api/realtors/{id} endpoint (Partial Update)
    - Create DELETE /api/realtors/{id} endpoint (Delete)
    - Add XML documentation comments for Swagger
    - Add proper HTTP status code responses (200, 201, 204, 400, 404)
    - _Requirements: 1.1, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 16.1, 16.2, 16.3, 16.4_

- [ ] 7. Implement global error handling and validation
  - Create global exception handler middleware
  - Implement custom exception types (NotFoundException, ValidationException)
  - Configure model validation with proper error responses
  - Add validation attributes to DTOs
  - Test error scenarios for all endpoints
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 8. Configure Swagger/OpenAPI documentation
  - Install and configure Swashbuckle.AspNetCore
  - Configure Swagger UI in Program.cs
  - Enable XML documentation comments
  - Add OpenApiInfo with API details
  - Add example requests/responses to controllers
  - Configure Swagger to display all endpoints with schemas
  - Test Swagger UI interface at /swagger endpoint
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [ ] 9. Configure and deploy database to AWS RDS
  - [ ] 9.1 Create AWS RDS instance
    - Create RDS instance (PostgreSQL or SQL Server)
    - Configure security group to allow inbound connections
    - Note endpoint URL and credentials
    - _Requirements: 7.1_

  - [ ] 9.2 Migrate database to AWS RDS
    - Update connection string to point to AWS RDS
    - Run EF Core migrations against RDS database
    - Verify seed data exists (10+ rows per table)
    - Test database connectivity from local development
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 10. Containerize API with Docker
  - Create Dockerfile for ASP.NET Core application
  - Configure Docker image with proper base images
  - Build Docker image locally and test
  - Verify application runs correctly in container
  - _Requirements: 8.1, 8.2, 8.4_

- [ ] 11. Deploy API to AWS ECS using Fargate
  - [ ] 11.1 Push Docker image to AWS ECR
    - Create ECR repository
    - Authenticate Docker with ECR

    - Tag Docker image appropriately
    - Push image to ECR
    - _Requirements: 8.3, 9.3_

  - [ ] 11.2 Create and configure ECS task definition
    - Create ECS cluster
    - Define task definition with container configuration
    - Configure CPU and memory allocation
    - Set environment variables (database connection string)
    - Configure port mappings
    - _Requirements: 9.1, 9.2_

  - [ ] 11.3 Run ECS task on Fargate
    - Launch task (not service) in ECS cluster
    - Configure networking with public IP
    - Configure security group for HTTP/HTTPS access
    - Verify task is running successfully
    - Test API endpoints using public IP/DNS
    - _Requirements: 9.2, 9.4, 9.5_

- [ ] 12. Configure Google APigee for API management
  - [ ] 12.1 Create APigee API proxy
    - Create new API proxy in Google APigee
    - Configure target endpoint to point to ECS Fargate URL
    - Configure proxy endpoint paths
    - _Requirements: 10.1, 10.2_

  - [ ] 12.2 Implement API key verification policy
    - Add "Verify API Key" policy to proxy
    - Configure policy to check x-api-key header
    - Test that requests without API key are rejected
    - Test that requests with valid API key are forwarded
    - _Requirements: 10.5, 10.6, 10.7_

  - [ ] 12.3 Create API product and developers
    - Create API Product in APigee
    - Add API proxy to product
    - Register at least 2 developers
    - Generate API keys for developers
    - _Requirements: 10.3, 10.4_

  - [ ] 12.4 Generate developer portal
    - Create developer portal in APigee
    - Configure portal to display API products
    - Enable API key management for developers
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 13. Create React web client application
  - [ ] 13.1 Initialize React project with Vite
    - Create Vite React app with TypeScript or JavaScript template
    - Install dependencies (axios, react-router-dom)
    - Set up project folder structure (components, services, types, hooks)
    - Configure environment variables (.env file with VITE_ prefix) for API URL and API key
    - _Requirements: 12.1_

  - [ ] 13.2 Create API client service
    - Create axios instance with base URL configuration
    - Configure default headers with API key
    - Implement error handling interceptors
    - _Requirements: 12.2, 12.3_

  - [ ] 13.3 Create TypeScript types/interfaces
    - Define Property, User, Realtor interfaces
    - Define Create and Update DTO types
    - _Requirements: 12.1_

  - [ ] 13.4 Implement property service layer
    - Create propertyService with getAll method
    - Create propertyService with getById method
    - Create propertyService with create method
    - Create propertyService with update method
    - Create propertyService with patch method
    - Create propertyService with delete method
    - _Requirements: 12.2, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 13.5 Implement user service layer
    - Create userService with getAll method
    - Create userService with getById method
    - Create userService with create method
    - Create userService with update method
    - Create userService with patch method
    - Create userService with delete method
    - _Requirements: 12.2, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 13.6 Implement realtor service layer
    - Create realtorService with getAll method
    - Create realtorService with getById method
    - Create realtorService with create method
    - Create realtorService with update method
    - Create realtorService with patch method
    - Create realtorService with delete method
    - _Requirements: 12.2, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 14. Implement React components for Properties
  - [ ] 14.1 Create PropertyList component
    - Display all properties in a list/grid
    - Call propertyService.getAll on component mount
    - Show loading state while fetching
    - Handle and display errors
    - Add navigation to detail view
    - _Requirements: 12.5, 13.1_

  - [ ] 14.2 Create PropertyDetail component
    - Display single property details
    - Call propertyService.getById with route parameter
    - Show loading and error states
    - Add edit and delete buttons
    - _Requirements: 13.2_

  - [ ] 14.3 Create PropertyForm component for create/edit
    - Create form with all property fields
    - Implement form validation
    - Call propertyService.create for new properties
    - Call propertyService.update for editing existing properties
    - Handle success and error responses
    - Redirect after successful submission
    - _Requirements: 13.3, 13.4, 13.5_

  - [ ] 14.4 Implement property delete functionality
    - Add delete confirmation dialog
    - Call propertyService.delete when confirmed
    - Handle success and error responses
    - Refresh list after deletion
    - _Requirements: 13.6_

- [ ] 15. Implement React components for Users
  - [ ] 15.1 Create UserList component
    - Display all users in a list/table
    - Call userService.getAll on component mount
    - Show loading state while fetching
    - Handle and display errors
    - Add navigation to detail view
    - _Requirements: 12.5, 14.1_

  - [ ] 15.2 Create UserDetail component
    - Display single user details
    - Call userService.getById with route parameter
    - Show loading and error states
    - Add edit and delete buttons
    - _Requirements: 14.2_

  - [ ] 15.3 Create UserForm component for create/edit
    - Create form with all user fields
    - Implement form validation
    - Call userService.create for new users
    - Call userService.update for editing existing users
    - Handle success and error responses
    - Redirect after successful submission
    - _Requirements: 14.3, 14.4, 14.5_

  - [ ] 15.4 Implement user delete functionality
    - Add delete confirmation dialog
    - Call userService.delete when confirmed
    - Handle success and error responses
    - Refresh list after deletion
    - _Requirements: 14.6_

- [ ] 16. Implement React components for Realtors
  - [ ] 16.1 Create RealtorList component
    - Display all realtors in a list/table
    - Call realtorService.getAll on component mount
    - Show loading state while fetching
    - Handle and display errors
    - Add navigation to detail view
    - _Requirements: 12.5, 15.1_

  - [ ] 16.2 Create RealtorDetail component
    - Display single realtor details
    - Call realtorService.getById with route parameter
    - Show loading and error states
    - Add edit and delete buttons
    - _Requirements: 15.2_

  - [ ] 16.3 Create RealtorForm component for create/edit
    - Create form with all realtor fields
    - Implement form validation
    - Call realtorService.create for new realtors
    - Call realtorService.update for editing existing realtors
    - Handle success and error responses
    - Redirect after successful submission
    - _Requirements: 15.3, 15.4, 15.5_

  - [ ] 16.4 Implement realtor delete functionality
    - Add delete confirmation dialog
    - Call realtorService.delete when confirmed
    - Handle success and error responses
    - Refresh list after deletion
    - _Requirements: 15.6_

- [ ] 17. Implement React routing and navigation
  - Configure React Router with routes for all pages
  - Create navigation component with links to Properties, Users, Realtors
  - Implement route guards if needed
  - Add 404 page for invalid routes
  - _Requirements: 12.1_

- [ ] 18. Build and deploy React application to AWS S3
  - [ ] 18.1 Build React application for production
    - Run production build command (npm run build)
    - Verify build output in dist/ directory (Vite default)
    - Test built application locally (npm run preview)
    - _Requirements: 12.4_

  - [ ] 18.2 Configure AWS S3 bucket for static hosting
    - Create S3 bucket with unique name
    - Enable static website hosting
    - Configure index document as index.html
    - Set bucket policy for public read access
    - Configure CORS for API calls
    - _Requirements: 12.4_

  - [ ] 18.3 Deploy React build to S3
    - Upload dist/ files to S3 bucket
    - Verify website is accessible via S3 URL
    - Test all functionality end-to-end
    - _Requirements: 12.4_

- [ ] 19. End-to-end testing and verification
  - Test all 6 HTTP methods for Properties controller through web client
  - Test all 6 HTTP methods for Users controller through web client
  - Test all 6 HTTP methods for Realtors controller through web client
  - Verify APigee API key authentication works correctly
  - Test error handling scenarios (invalid data, not found, etc.)
  - Verify Swagger documentation is complete and accurate
  - Verify all data persists correctly in AWS RDS
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 20. Create project documentation and presentation materials
  - Create architecture diagram showing all components
  - Create ER diagram for database schema
  - Document sample data in each table
  - Prepare presentation demonstrating all functionalities
  - Document experiences gained and lessons learned
  - Prepare answers for potential questions
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
