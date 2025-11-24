# Real Estate Frontend Documentation

## Overview
Material-UI React frontend for the Real Estate API with complete CRUD operations.

## Tech Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Vite** for build tooling
- **Axios** for API calls

## Project Structure
```
RealEstateClient/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Statistics dashboard
│   │   ├── PropertyList.tsx       # Property management
│   │   ├── PropertyForm.tsx       # Add/Edit properties
│   │   ├── UserList.tsx          # User management
│   │   ├── UserForm.tsx          # Add/Edit users
│   │   ├── RealtorList.tsx       # Realtor management
│   │   ├── RealtorForm.tsx       # Add/Edit realtors
│   │   └── index.ts              # Component exports
│   ├── services/
│   │   ├── propertyService.ts    # Property API calls
│   │   ├── userService.ts        # User API calls
│   │   ├── realtorService.ts     # Realtor API calls
│   │   └── index.ts              # Service exports
│   ├── api/
│   │   └── client.ts             # Axios configuration
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── App.tsx                   # Main application
```

## Features

### Dashboard
- Property, User, Realtor counts
- Average property price
- Statistics cards with icons

### Property Management
- **List View**: Cards with property details, status chips
- **Create**: Form with address, price, bedrooms, bathrooms, etc.
- **Edit**: Pre-filled form for updates
- **Delete**: Confirmation dialog

### User Management
- **List View**: User cards with avatars, contact info
- **Create**: Form with name, email, phone, address
- **Edit**: Pre-filled form for updates
- **Delete**: Confirmation dialog
- **Status**: Active/Inactive toggle

### Realtor Management
- **List View**: Realtor cards with experience levels
- **Create**: Form with license, agency, specialization
- **Edit**: Pre-filled form for updates
- **Delete**: Confirmation dialog
- **Experience**: Color-coded experience chips

## API Integration

### Configuration
```typescript
// .env
VITE_API_BASE_URL=http://13.220.170.69/reAPI
VITE_API_KEY=your-api-key-here
```

### Service Layer
Each entity has a service with methods:
- `getAll()` - Fetch all records
- `getById(id)` - Fetch single record
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Delete record

### API Endpoints
- Properties: `/reAPI/properties`
- Users: `/reAPI/users`
- Realtors: `/reAPI/realtors`

## Components

### Form Components
All forms include:
- Validation (required fields)
- Loading states
- Error handling
- Cancel/Save actions
- Modal dialogs

### List Components
All lists include:
- Loading spinners
- Error alerts
- Empty state messages
- Add/Edit/Delete buttons
- Responsive grid layout

## Setup & Development

### Installation
```bash
cd RealEstateClient
npm install
```

### Development
```bash
npm run dev
# Runs on http://localhost:5173
```

### Build
```bash
npm run build
# Creates dist/ folder for deployment
```

## Material-UI Theme
- Primary: Blue (#1976d2)
- Secondary: Pink (#dc004e)
- Background: Light gray (#f5f5f5)
- Responsive breakpoints
- Custom typography weights

## Navigation
- Sidebar navigation (desktop)
- Mobile hamburger menu
- Route-based view switching
- Active state indicators

## Error Handling
- Network error alerts
- Form validation messages
- Loading states for async operations
- User-friendly error messages

## Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Collapsible sidebar on mobile
- Touch-friendly buttons

## Future Enhancements
- Search and filtering
- Pagination for large datasets
- Image upload for properties
- Advanced property filters
- User authentication
- Real-time updates