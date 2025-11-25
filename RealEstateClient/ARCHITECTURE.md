# Real Estate Client - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Application (SPA)                         │    │
│  │         Hosted on AWS S3                                │    │
│  │         http://bucket-name.s3-website-region.com        │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS Requests
                              │ (with x-api-key header)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE APIGEE GATEWAY                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  API Proxy: real-estate-api                             │    │
│  │  - Verify API Key Policy                                │    │
│  │  - Rate Limiting                                        │    │
│  │  - CORS Headers                                         │    │
│  │  - Request/Response Transformation                      │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Forwarded Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS ECS FARGATE                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Real Estate API Container                              │    │
│  │  - ASP.NET Core 8.0                                     │    │
│  │  - Controllers (Properties, Users, Realtors)           │    │
│  │  - Services (Business Logic)                            │    │
│  │  - Repositories (Data Access)                           │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AWS RDS                                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  SQL Server Database                                    │    │
│  │  - Properties Table (10+ rows)                          │    │
│  │  - Users Table (10+ rows)                               │    │
│  │  - Realtors Table (10+ rows)                            │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT APPLICATION                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION LAYER                     │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Properties  │  │    Users     │  │   Realtors   │   │  │
│  │  │  Components  │  │  Components  │  │  Components  │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  │ - List       │  │ - List       │  │ - List       │   │  │
│  │  │ - Detail     │  │ - Detail     │  │ - Detail     │   │  │
│  │  │ - Form       │  │ - Form       │  │ - Form       │   │  │
│  │  │ - PatchForm  │  │ - PatchForm  │  │ - PatchForm  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         Common Components                           │  │  │
│  │  │  - Button  - Modal  - LoadingSpinner               │  │  │
│  │  │  - ErrorMessage  - ConfirmDialog  - Card           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SERVICE LAYER                          │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Property    │  │    User      │  │   Realtor    │   │  │
│  │  │  Service     │  │   Service    │  │   Service    │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  │ - getAll     │  │ - getAll     │  │ - getAll     │   │  │
│  │  │ - getById    │  │ - getById    │  │ - getById    │   │  │
│  │  │ - create     │  │ - create     │  │ - create     │   │  │
│  │  │ - update     │  │ - update     │  │ - update     │   │  │
│  │  │ - patch      │  │ - patch      │  │ - patch      │   │  │
│  │  │ - delete     │  │ - delete     │  │ - delete     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      API LAYER                            │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Property    │  │    User      │  │   Realtor    │   │  │
│  │  │    API       │  │     API      │  │     API      │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  │ GET /props   │  │ GET /users   │  │ GET /realtors│   │  │
│  │  │ GET /props/1 │  │ GET /users/1 │  │ GET /real/1  │   │  │
│  │  │ POST /props  │  │ POST /users  │  │ POST /real   │   │  │
│  │  │ PUT /props/1 │  │ PUT /users/1 │  │ PUT /real/1  │   │  │
│  │  │ PATCH /pr/1  │  │ PATCH /usr/1 │  │ PATCH /re/1  │   │  │
│  │  │ DELETE /pr/1 │  │ DELETE /us/1 │  │ DELETE /re/1 │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         Axios Client (with API Key)                 │  │  │
│  │  │  - Base URL: APigee Gateway                         │  │  │
│  │  │  - Headers: x-api-key, Content-Type                │  │  │
│  │  │  - Interceptors: Request/Response logging          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```


---

## Data Flow Diagrams

### 1. GET All Properties Flow

```
User clicks "Properties"
        │
        ▼
PropertyList Component
        │
        ├─ useEffect() triggers
        │
        ▼
propertyService.getAllProperties()
        │
        ▼
propertyApi.getAll()
        │
        ▼
axios.get('/properties')
        │
        ├─ Headers: { x-api-key: "..." }
        │
        ▼
APigee Gateway
        │
        ├─ Verify API Key ✓
        ├─ Add CORS headers
        │
        ▼
Real Estate API
        │
        ├─ PropertiesController.GetAll()
        ├─ PropertyService.GetAllAsync()
        ├─ PropertyRepository.GetAllAsync()
        │
        ▼
RDS Database
        │
        ├─ SELECT * FROM Properties
        │
        ▼
Response: Property[]
        │
        ├─ Map to PropertyReadDto[]
        │
        ▼
APigee Gateway
        │
        ▼
React App
        │
        ├─ setProperties(data)
        │
        ▼
UI Updates: Display property cards
```

### 2. POST Create Property Flow

```
User fills form and clicks "Save"
        │
        ▼
PropertyForm Component
        │
        ├─ handleSubmit()
        ├─ validate() ✓
        │
        ▼
propertyService.createProperty(formData)
        │
        ▼
propertyApi.create(data)
        │
        ▼
axios.post('/properties', data)
        │
        ├─ Headers: { x-api-key: "...", Content-Type: "application/json" }
        ├─ Body: PropertyCreateDto
        │
        ▼
APigee Gateway
        │
        ├─ Verify API Key ✓
        │
        ▼
Real Estate API
        │
        ├─ PropertiesController.Create()
        ├─ Validate ModelState ✓
        ├─ PropertyService.CreateAsync()
        ├─ Map DTO to Entity
        ├─ PropertyRepository.AddAsync()
        │
        ▼
RDS Database
        │
        ├─ INSERT INTO Properties VALUES (...)
        ├─ Return new ID
        │
        ▼
Response: Property (with ID)
        │
        ├─ Map to PropertyReadDto
        │
        ▼
APigee Gateway
        │
        ▼
React App
        │
        ├─ Success!
        ├─ navigate('/properties')
        │
        ▼
UI Updates: Redirect to list, show new property
```

### 3. PATCH Update Property Flow

```
User selects field and enters new value
        │
        ▼
PropertyPatchForm Component
        │
        ├─ addPatch()
        ├─ patches = [{ op: "replace", path: "/price", value: 450000 }]
        │
        ▼
propertyService.patchProperty(id, patches)
        │
        ▼
propertyApi.patch(id, patches)
        │
        ▼
axios.patch('/properties/1', patches)
        │
        ├─ Headers: { 
        │     x-api-key: "...", 
        │     Content-Type: "application/json-patch+json" 
        │   }
        ├─ Body: [{ op: "replace", path: "/price", value: 450000 }]
        │
        ▼
APigee Gateway
        │
        ├─ Verify API Key ✓
        │
        ▼
Real Estate API
        │
        ├─ PropertiesController.Patch()
        ├─ Apply JSON Patch operations
        ├─ Validate patched entity
        ├─ PropertyService.UpdateAsync()
        ├─ PropertyRepository.UpdateAsync()
        │
        ▼
RDS Database
        │
        ├─ UPDATE Properties SET Price = 450000 WHERE Id = 1
        │
        ▼
Response: Updated Property
        │
        ├─ Map to PropertyReadDto
        │
        ▼
APigee Gateway
        │
        ▼
React App
        │
        ├─ Success!
        ├─ navigate('/properties/1')
        │
        ▼
UI Updates: Show updated property detail
```

### 4. DELETE Property Flow

```
User clicks "Delete" button
        │
        ▼
ConfirmDialog appears
        │
        ├─ User clicks "Confirm"
        │
        ▼
PropertyDetail Component
        │
        ├─ handleDelete()
        │
        ▼
propertyService.deleteProperty(id)
        │
        ▼
propertyApi.delete(id)
        │
        ▼
axios.delete('/properties/1')
        │
        ├─ Headers: { x-api-key: "..." }
        │
        ▼
APigee Gateway
        │
        ├─ Verify API Key ✓
        │
        ▼
Real Estate API
        │
        ├─ PropertiesController.Delete()
        ├─ PropertyService.DeleteAsync()
        ├─ PropertyRepository.DeleteAsync()
        │
        ▼
RDS Database
        │
        ├─ DELETE FROM Properties WHERE Id = 1
        │
        ▼
Response: 204 No Content
        │
        ▼
APigee Gateway
        │
        ▼
React App
        │
        ├─ Success!
        ├─ navigate('/properties')
        │
        ▼
UI Updates: Property removed from list
```

---

## Component Hierarchy

```
App
├── Router
│   ├── Navigation
│   │   ├── Logo
│   │   └── NavLinks
│   │       ├── Properties Link
│   │       ├── Users Link
│   │       └── Realtors Link
│   │
│   └── Routes
│       │
│       ├── Properties Routes
│       │   ├── PropertyList
│       │   │   ├── SearchBar
│       │   │   ├── Filters
│       │   │   └── PropertyCard (multiple)
│       │   │       ├── PropertyInfo
│       │   │       └── ActionButtons
│       │   │
│       │   ├── PropertyDetail
│       │   │   ├── BackButton
│       │   │   ├── PropertyInfo
│       │   │   ├── ActionButtons
│       │   │   └── ConfirmDialog (conditional)
│       │   │
│       │   ├── PropertyForm (Create/Edit)
│       │   │   ├── BackButton
│       │   │   ├── FormFields (multiple)
│       │   │   ├── ValidationErrors
│       │   │   └── FormActions
│       │   │
│       │   └── PropertyPatchForm
│       │       ├── BackButton
│       │       ├── FieldSelector
│       │       ├── PatchList
│       │       └── FormActions
│       │
│       ├── Users Routes
│       │   ├── UserList
│       │   ├── UserDetail
│       │   ├── UserForm
│       │   └── UserPatchForm
│       │
│       └── Realtors Routes
│           ├── RealtorList
│           ├── RealtorDetail
│           ├── RealtorForm
│           └── RealtorPatchForm
│
└── Common Components (used throughout)
    ├── Button
    ├── Card
    ├── Modal
    ├── LoadingSpinner
    ├── ErrorMessage
    └── ConfirmDialog
```

---

## State Management

### Component-Level State

Each component manages its own state using React hooks:

```typescript
// List Components
const [items, setItems] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [filters, setFilters] = useState({ ... });

// Detail Components
const [item, setItem] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

// Form Components
const [formData, setFormData] = useState<T>({ ... });
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Patch Form Components
const [patches, setPatches] = useState<PatchOperation[]>([]);
const [selectedField, setSelectedField] = useState('');
const [fieldValue, setFieldValue] = useState('');
```

### No Global State Management

For this MVP, we don't need Redux or Context API because:
- Each page fetches its own data
- No shared state between routes
- Simple parent-child communication
- Keeps implementation simple

---

## API Endpoints Reference

### Properties Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/properties` | Get all properties | - | Property[] |
| GET | `/api/properties/{id}` | Get property by ID | - | Property |
| POST | `/api/properties` | Create property | PropertyCreate | Property |
| PUT | `/api/properties/{id}` | Update property | Property | Property |
| PATCH | `/api/properties/{id}` | Partial update | PatchOperation[] | Property |
| DELETE | `/api/properties/{id}` | Delete property | - | 204 No Content |

### Users Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/users` | Get all users | - | User[] |
| GET | `/api/users/{id}` | Get user by ID | - | User |
| POST | `/api/users` | Create user | UserCreate | User |
| PUT | `/api/users/{id}` | Update user | User | User |
| PATCH | `/api/users/{id}` | Partial update | PatchOperation[] | User |
| DELETE | `/api/users/{id}` | Delete user | - | 204 No Content |

### Realtors Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/realtors` | Get all realtors | - | Realtor[] |
| GET | `/api/realtors/{id}` | Get realtor by ID | - | Realtor |
| POST | `/api/realtors` | Create realtor | RealtorCreate | Realtor |
| PUT | `/api/realtors/{id}` | Update realtor | Realtor | Realtor |
| PATCH | `/api/realtors/{id}` | Partial update | PatchOperation[] | Realtor |
| DELETE | `/api/realtors/{id}` | Delete realtor | - | 204 No Content |

---

## Security Architecture

### API Key Authentication

```
┌─────────────────────────────────────────────────────────────┐
│  React App                                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  .env file (not in Git)                             │    │
│  │  VITE_API_KEY=abc123xyz789                          │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                    │
│                         ▼                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Axios Client                                       │    │
│  │  headers: { 'x-api-key': import.meta.env.VITE_API_KEY } │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  APigee Gateway                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Verify API Key Policy                              │    │
│  │  - Extract x-api-key header                         │    │
│  │  - Validate against registered keys                 │    │
│  │  - Check product association                        │    │
│  │  - Verify developer app status                      │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                    │
│                    ✓ Valid │ ✗ Invalid                      │
│                         │   │                                │
│                         │   └─> 401 Unauthorized            │
│                         ▼                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Forward to Backend API                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### CORS Configuration

APigee adds these headers to responses:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key
Access-Control-Max-Age: 3600
```

---

## Deployment Architecture

### Development Environment

```
Developer Machine
├── React Dev Server (Vite)
│   └── http://localhost:5173
│
└── API (Local or ECS)
    └── http://localhost:5045 or https://ecs-endpoint.com
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│  AWS S3 Bucket (Static Website Hosting)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Bucket: real-estate-client-[name]                  │    │
│  │  Region: us-east-1                                  │    │
│  │  Website Endpoint:                                  │    │
│  │  http://bucket.s3-website-us-east-1.amazonaws.com  │    │
│  │                                                      │    │
│  │  Contents:                                          │    │
│  │  ├── index.html                                     │    │
│  │  ├── assets/                                        │    │
│  │  │   ├── index-[hash].js                            │    │
│  │  │   └── index-[hash].css                           │    │
│  │  └── vite.svg                                       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Build Process

```
Source Code (src/)
        │
        ├─ TypeScript files (.tsx, .ts)
        ├─ CSS files (.css)
        ├─ Assets (images, icons)
        │
        ▼
Vite Build Process
        │
        ├─ Transpile TypeScript → JavaScript
        ├─ Bundle modules
        ├─ Minify code
        ├─ Optimize assets
        ├─ Generate hashed filenames
        │
        ▼
Production Build (dist/)
        │
        ├─ index.html
        ├─ assets/index-[hash].js (minified)
        ├─ assets/index-[hash].css (minified)
        └─ assets/[images]
        │
        ▼
Upload to S3
        │
        └─ aws s3 sync dist/ s3://bucket-name/
```

---

## Technology Stack Summary

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.2 | Build tool & dev server |
| React Router | 7.9.6 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| ESLint | 9.39.1 | Code linting |

### Cloud Services

| Service | Purpose |
|---------|---------|
| AWS S3 | Static website hosting |
| Google APigee | API gateway & management |
| AWS ECS Fargate | Backend API hosting |
| AWS RDS | Database |

### Development Tools

| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Git | Version control |
| npm | Package management |
| AWS CLI | Deployment |
| Postman | API testing |

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Vite automatically splits code by route
2. **Lazy Loading**: Components loaded on demand
3. **Minification**: Production build is minified
4. **Caching**: Static assets have cache headers
5. **CDN**: S3 can be fronted with CloudFront (optional)

### Bundle Size Targets

- Initial JS bundle: < 200 KB
- Initial CSS bundle: < 50 KB
- Total page load: < 2 seconds

---

## Monitoring & Debugging

### Development

- React DevTools for component inspection
- Browser DevTools for network requests
- Console logging for debugging
- Axios interceptors for request/response logging

### Production

- Browser console for client-side errors
- APigee analytics for API usage
- CloudWatch logs for backend errors
- S3 access logs for traffic analysis

---

## Future Enhancements (Post-MVP)

1. **Authentication**: User login with JWT tokens
2. **Authorization**: Role-based access control
3. **Real-time Updates**: WebSocket for live data
4. **Image Upload**: Property photos with S3
5. **Advanced Search**: Full-text search, filters
6. **Pagination**: Handle large datasets
7. **Caching**: Client-side caching with React Query
8. **PWA**: Progressive Web App features
9. **Analytics**: User behavior tracking
10. **Testing**: Unit tests, integration tests, E2E tests

---

This architecture provides a solid foundation for a production-ready real estate application while maintaining simplicity for the academic MVP requirements.
