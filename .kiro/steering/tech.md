# Technology Stack

## Backend (RealEstateAPI)

### Framework & Runtime
- **ASP.NET Core 8.0** (net8.0)
- **C#** with nullable reference types enabled
- **Entity Framework Core 8.0.11** for ORM

### Key Libraries
- **AutoMapper 12.0.1** - DTO to entity mapping
- **Swashbuckle.AspNetCore 7.2.0** - Swagger/OpenAPI documentation
- **Microsoft.AspNetCore.JsonPatch 8.0.11** - PATCH operation support
- **Newtonsoft.Json** - JSON serialization for JsonPatch
- **Microsoft.EntityFrameworkCore.SqlServer 8.0.11** - SQL Server provider

### Database
- **Development**: SQL Server LocalDB (mssqllocaldb)
- **Production**: AWS RDS (SQL Server)
- Connection string in `appsettings.json` under `ConnectionStrings:DefaultConnection`

### Common Commands

```bash
# Restore packages
dotnet restore

# Build project
dotnet build

# Run API (development)
dotnet run

# Apply database migrations
dotnet ef database update

# Create new migration (coordinate with team first)
dotnet ef migrations add MigrationName

# Clean build artifacts
dotnet clean
```

### API Access
- HTTPS: `https://localhost:7111`
- HTTP: `http://localhost:5045`
- Swagger UI: `https://localhost:7111/swagger`

## Frontend (RealEstateClient)

### Framework & Build Tool
- **React 19.2.0** with React DOM
- **Vite 7.2.2** - Build tool and dev server
- **TypeScript 5.9.3** - Type-safe JavaScript

### Key Libraries
- **axios 1.13.2** - HTTP client for API calls
- **react-router-dom 7.9.6** - Client-side routing
- **@vitejs/plugin-react 5.1.0** - Vite React plugin

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript ESLint 8.46.3** - TypeScript-specific linting
- **eslint-plugin-react-hooks** - React hooks linting

### Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm preview
```

### Dev Server Access
- Local: `http://localhost:5173`

### Environment Variables
Create `.env` file with:
```
VITE_API_BASE_URL=https://your-apigee-url.com/api
VITE_API_KEY=your-api-key-here
```

## Cloud Infrastructure

### AWS Services
- **AWS RDS** - Managed SQL Server database
- **AWS ECR** - Docker container registry
- **AWS ECS Fargate** - Serverless container hosting
- **AWS S3** - Static website hosting for React app
- **AWS IAM** - Access management

### API Gateway
- **Google APigee** - API management, security, rate limiting

### Containerization
- **Docker** - API containerization
- Dockerfile in RealEstateAPI directory

## Architecture Pattern

Three-layered architecture:
1. **Controllers** - HTTP request/response handling
2. **Services** - Business logic (if implemented)
3. **Repositories** - Data access with Repository Pattern

Generic repository interface (`IRepository<T>`) provides standard CRUD operations for all entities.
