# Project Structure

## Root Organization

```plainText
/
├── RealEstateAPI/          # Backend ASP.NET Core API
├── RealEstateClient/       # Frontend React application
├── project instructions and info/  # Academic requirements and proposals
└── .kiro/                  # Kiro AI assistant configuration
```

## RealEstateAPI Structure

```plainText
RealEstateAPI/
├── Controllers/            # API controllers (HTTP endpoints)
├── Services/              # Business logic layer (if implemented)
├── Repositories/          # Data access layer with Repository Pattern
│   ├── IRepository.cs     # Generic repository interface
│   ├── I{Entity}Repository.cs  # Entity-specific interfaces
│   └── {Entity}Repository.cs   # Repository implementations
├── Models/                # Entity models (database entities)
│   ├── Property.cs
│   ├── User.cs
│   └── Realtor.cs
├── DTOs/                  # Data Transfer Objects (API contracts)
├── Data/                  # DbContext and database configuration
├── Profiles/              # AutoMapper mapping profiles
├── Exceptions/            # Custom exception classes
├── Migrations/            # Entity Framework migrations
├── Properties/            # Project properties
├── Program.cs             # Application entry point and configuration
├── appsettings.json       # Configuration (connection strings, logging)
├── appsettings.Development.json  # Development-specific config
├── appsettings.Production.json   # Production-specific config
└── RealEstateAPI.csproj   # Project file
```

### Key Conventions

- **Namespace structure**: Follows folder structure (e.g., `RealEstateAPI.Models`, `RealEstateAPI.Repositories`)
- **Nullable reference types**: Enabled project-wide
- **String initialization**: Empty strings use `string.Empty` pattern
- **Async operations**: All repository methods are async (suffix: `Async`)
- **XML documentation**: Models and interfaces include XML doc comments
- **Dependency injection**: Services registered in `Program.cs`
- **Generic repository**: Base `IRepository<T>` interface for common CRUD operations

## RealEstateClient Structure

```
RealEstateClient/
├── src/
│   ├── components/        # React components
│   ├── services/          # API service layer (axios calls)
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static assets (images, icons)
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Public static files
├── node_modules/          # Dependencies (not in git)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TypeScript config
├── tsconfig.node.json     # Node-specific TypeScript config
├── vite.config.ts         # Vite build configuration
├── eslint.config.js       # ESLint configuration
├── .env                   # Environment variables (not in git)
└── .env.example           # Environment variable template
```

### Key Conventions

- **Component organization**: Components in `src/components/`
- **API calls**: Centralized in `src/services/` using axios
- **Type safety**: TypeScript types in `src/types/`
- **Environment variables**: Prefix with `VITE_` for Vite access
- **Module type**: ES modules (`"type": "module"` in package.json)

## Configuration Files

### Backend

- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development overrides (LocalDB)
- `appsettings.Production.json` - Production overrides (AWS RDS)

### Frontend

- `.env` - Environment-specific variables (API URL, API key)
- `.env.example` - Template for required environment variables

## Database Migrations

Located in `RealEstateAPI/Migrations/`

- Tracked in Git for team consistency
- Applied with `dotnet ef database update`
- **Important**: Coordinate with team before creating new migrations

## Documentation

- `README.md` - Root project overview
- `RealEstateAPI/README.md` - Backend setup and architecture
- `RealEstateClient/README.md` - Frontend setup (Vite template)
- `.kiro/specs/real-estate-api/` - Detailed requirements and design specs
- `project instructions and info/` - Academic requirements and marking scheme

## Ignored Files

### Backend (.gitignore)

- `bin/`, `obj/` - Build artifacts
- `*.user` - User-specific settings

### Frontend (.gitignore)

- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env` - Environment variables (use `.env.example` as template)
