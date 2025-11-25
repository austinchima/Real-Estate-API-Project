# API Configuration Guide

## 🌐 Production API Endpoints

### Base URL
```
http://13.220.170.69
```

### Swagger Documentation
```
http://13.220.170.69/swagger
```

### Entity Endpoints

#### Properties
```
GET    http://13.220.170.69/api/properties
GET    http://13.220.170.69/api/properties/{id}
POST   http://13.220.170.69/api/properties
PUT    http://13.220.170.69/api/properties/{id}
PATCH  http://13.220.170.69/api/properties/{id}
DELETE http://13.220.170.69/api/properties/{id}
```

#### Users
```
GET    http://13.220.170.69/api/users
GET    http://13.220.170.69/api/users/{id}
POST   http://13.220.170.69/api/users
PUT    http://13.220.170.69/api/users/{id}
PATCH  http://13.220.170.69/api/users/{id}
DELETE http://13.220.170.69/api/users/{id}
```

#### Realtors
```
GET    http://13.220.170.69/api/realtors
GET    http://13.220.170.69/api/realtors/{id}
POST   http://13.220.170.69/api/realtors
PUT    http://13.220.170.69/api/realtors/{id}
PATCH  http://13.220.170.69/api/realtors/{id}
DELETE http://13.220.170.69/api/realtors/{id}
```

## ⚙️ Configuration Files

### `.env` (Active Configuration)
```env
VITE_API_BASE_URL=http://13.220.170.69/api
VITE_API_KEY=WAT4f63rw5HQi557poN8mVveo17BEUyyoPLif36AWSB0oLGB
```

### `.env.example` (Template)
```env
VITE_API_BASE_URL=http://13.220.170.69/api
VITE_API_KEY=
```

## 🔧 Client Configuration

The API client is configured in `src/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://13.220.170.69/api',
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY && { 'x-api-key': import.meta.env.VITE_API_KEY })
  }
});
```

## 🚀 Usage

The React application automatically uses these endpoints through the service layer:

- `propertyService` → `/api/properties`
- `userService` → `/api/users`
- `realtorService` → `/api/realtors`

## 🔐 Authentication

API Key is included in the `x-api-key` header when provided in the `.env` file.

## 📝 Notes

- No trailing slashes in base URL
- API key is optional (conditionally added)
- All endpoints use JSON content type
- CORS is configured on the server side
