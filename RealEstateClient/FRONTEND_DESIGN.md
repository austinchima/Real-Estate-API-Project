# Real Estate Client - Frontend Design Document

## Student 3 Task Analysis & Implementation Plan

### Project Context

**Academic Requirements:**

- Implement React web client consuming the Real Estate API through APigee gateway
- Demonstrate all 6 HTTP methods (GET all, GET by ID, POST, PUT, PATCH, DELETE) for 3 entities
- Worth 18 marks (6 methods × 3 entities) + 1 mark for HttpClient setup + 2 marks for overall quality
- Deploy to AWS S3 for static hosting

**Current Implementation Status:**
✅ Basic React app with Vite + TypeScript
✅ Axios client configured with APigee API key support
✅ React Router setup with basic navigation
✅ Service layer structure (propertyService, userService, realtorService)
✅ Basic list components for all entities
✅ Basic form components for create operations
✅ DELETE functionality implemented

❌ TypeScript types/interfaces not defined
❌ GET by ID (detail views) not fully implemented
❌ PUT (full update) not implemented
❌ PATCH (partial update) not implemented
❌ Edit functionality incomplete
❌ Error handling needs improvement
❌ Loading states need enhancement
❌ UI/UX needs significant improvement
❌ Form validation missing
❌ No confirmation dialogs for destructive actions

---

## Design Philosophy

### Core Principles

1. **Simplicity First**: MVP focused on demonstrating all required HTTP methods
2. **Academic Compliance**: Clear demonstration of each CRUD operation for marking
3. **User-Friendly**: Intuitive navigation and clear action buttons
4. **Responsive**: Works on desktop and tablet (mobile optional)
5. **Error Resilient**: Graceful error handling with user feedback


### Visual Design Approach

**Layout:**

- Clean, card-based design for data display
- Sidebar or top navigation for entity switching
- Breadcrumb navigation for context
- Modal dialogs for forms (create/edit)

**Color Scheme:**

- Primary: Blue (#2563eb) - Actions, links
- Success: Green (#10b981) - Create, save
- Warning: Orange (#f59e0b) - Edit, update
- Danger: Red (#ef4444) - Delete
- Neutral: Gray (#6b7280) - Text, borders

**Typography:**

- Headers: Bold, clear hierarchy
- Body: Readable 16px base
- Monospace for IDs and technical data

---

## Architecture Overview

### Component Structure

```
src/
├── components/
│   ├── common/              # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ConfirmDialog.tsx
│   ├── layout/              # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── properties/          # Property components
│   │   ├── PropertyList.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── PropertyForm.tsx
│   │   └── PropertyPatchForm.tsx
│   ├── users/               # User components
│   │   ├── UserList.tsx
│   │   ├── UserCard.tsx
│   │   ├── UserDetail.tsx
│   │   ├── UserForm.tsx
│   │   └── UserPatchForm.tsx
│   └── realtors/            # Realtor components
│       ├── RealtorList.tsx
│       ├── RealtorCard.tsx
│       ├── RealtorDetail.tsx
│       ├── RealtorForm.tsx
│       └── RealtorPatchForm.tsx
├── types/
│   ├── property.ts
│   ├── user.ts
│   ├── realtor.ts
│   └── common.ts
├── services/
│   ├── propertyService.ts
│   ├── userService.ts
│   └── realtorService.ts
├── api/
│   ├── client.ts
│   ├── properties.ts
│   ├── users.ts
│   └── realtors.ts
├── hooks/
│   ├── useProperties.ts
│   ├── useUsers.ts
│   └── useRealtors.ts
└── utils/
    ├── formatters.ts
    └── validators.ts
```


---

## Data Models (TypeScript Types)

### Property Types

```typescript
export interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  status: string;
  realtorId?: number;
  listedDate: string;
  description: string;
}

export interface PropertyCreate {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  status: string;
  realtorId?: number;
  listedDate: string;
  description: string;
}

export interface PropertyPatch {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: any;
}
```

### User Types

```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  isActive: boolean;
}

export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  isActive: boolean;
}

export interface UserPatch {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: any;
}
```

### Realtor Types

```typescript
export interface Realtor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specialization: string;
  isActive: boolean;
}

export interface RealtorCreate {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specialization: string;
  isActive: boolean;
}

export interface RealtorPatch {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: any;
}
```


---

## Routing Structure

### Route Definitions

```typescript
// Main routes
/                           → PropertyList (Home)
/properties                 → PropertyList
/properties/:id             → PropertyDetail (GET by ID)
/properties/new             → PropertyForm (POST)
/properties/:id/edit        → PropertyForm (PUT)
/properties/:id/patch       → PropertyPatchForm (PATCH)

/users                      → UserList
/users/:id                  → UserDetail (GET by ID)
/users/new                  → UserForm (POST)
/users/:id/edit             → UserForm (PUT)
/users/:id/patch            → UserPatchForm (PATCH)

/realtors                   → RealtorList
/realtors/:id               → RealtorDetail (GET by ID)
/realtors/new               → RealtorForm (POST)
/realtors/:id/edit          → RealtorForm (PUT)
/realtors/:id/patch         → RealtorPatchForm (PATCH)
```

### Navigation Flow

```
Home (PropertyList)
  ├─ View Property Detail → PropertyDetail
  │   ├─ Edit (PUT) → PropertyForm
  │   ├─ Quick Edit (PATCH) → PropertyPatchForm
  │   └─ Delete → Confirmation → Back to List
  └─ Create New → PropertyForm

Users
  ├─ View User Detail → UserDetail
  │   ├─ Edit (PUT) → UserForm
  │   ├─ Quick Edit (PATCH) → UserPatchForm
  │   └─ Delete → Confirmation → Back to List
  └─ Create New → UserForm

Realtors
  ├─ View Realtor Detail → RealtorDetail
  │   ├─ Edit (PUT) → RealtorForm
  │   ├─ Quick Edit (PATCH) → RealtorPatchForm
  │   └─ Delete → Confirmation → Back to List
  └─ Create New → RealtorForm
```

---

## Component Specifications

### 1. PropertyList Component

**Purpose:** Display all properties (GET all)

**Features:**
- Grid/card layout of properties
- Search/filter by property type, status
- Sort by price, date listed
- Quick actions: View, Edit, Delete
- "Add New Property" button

**UI Elements:**
- Search bar at top
- Filter dropdowns (Type, Status)
- Property cards with:
  - Property image placeholder
  - Address, City, State
  - Price (formatted)
  - Bedrooms/Bathrooms
  - Square footage
  - Status badge
  - Action buttons

**State Management:**
- properties: Property[]
- loading: boolean
- error: string | null
- filters: { type, status, search }


### 2. PropertyDetail Component

**Purpose:** Display single property details (GET by ID)

**Features:**
- Full property information display
- Breadcrumb navigation
- Action buttons: Edit (PUT), Quick Edit (PATCH), Delete
- Related realtor information (if assigned)

**UI Elements:**
- Large property details card
- All property fields displayed
- Formatted dates and currency
- Status indicator
- Action button group
- Back to list button

**State Management:**
- property: Property | null
- loading: boolean
- error: string | null

### 3. PropertyForm Component

**Purpose:** Create new property (POST) or full update (PUT)

**Features:**
- Form validation
- Required field indicators
- Real-time validation feedback
- Cancel and Save buttons
- Success/error messages

**Form Fields:**
- Address (text, required)
- City (text, required)
- State (text, required)
- Zip Code (text, required)
- Price (number, required, min: 0)
- Bedrooms (number, required, min: 0)
- Bathrooms (number, required, min: 0)
- Square Feet (number, required, min: 0)
- Property Type (select: House, Condo, Apartment, Townhouse)
- Status (select: Available, Pending, Sold)
- Realtor ID (number, optional)
- Listed Date (date, required)
- Description (textarea, optional)

**Validation Rules:**
- All required fields must be filled
- Price must be positive
- Bedrooms/Bathrooms must be non-negative
- Email format validation
- Phone format validation

**State Management:**
- formData: PropertyCreate | Property
- errors: Record<string, string>
- isSubmitting: boolean
- mode: 'create' | 'edit'


### 4. PropertyPatchForm Component

**Purpose:** Partial update of property (PATCH)

**Features:**
- Select which field to update
- Only show selected field's input
- Support multiple patch operations
- Preview changes before submitting

**UI Elements:**
- Field selector dropdown
- Dynamic input based on selected field
- Operation selector (replace, add, remove)
- Add another patch button
- List of pending patches
- Submit all patches button

**Patch Operations:**
```json
[
  { "op": "replace", "path": "/price", "value": 450000 },
  { "op": "replace", "path": "/status", "value": "Sold" }
]
```

**State Management:**
- patches: PropertyPatch[]
- selectedField: string
- currentValue: any

### 5. Common Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'success';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

#### ConfirmDialog Component
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

#### LoadingSpinner Component
- Centered spinner
- Optional message
- Overlay option

#### ErrorMessage Component
- Red alert box
- Error icon
- Dismissible
- Retry button option


---

## API Integration

### Service Layer Pattern

Each entity has a service that wraps API calls:

```typescript
// propertyService.ts
export const propertyService = {
  // GET all
  async getAllProperties(): Promise<Property[]> {
    const response = await propertyApi.getAll();
    return response.data;
  },

  // GET by ID
  async getProperty(id: number): Promise<Property> {
    const response = await propertyApi.getById(id);
    return response.data;
  },

  // POST
  async createProperty(data: PropertyCreate): Promise<Property> {
    const response = await propertyApi.create(data);
    return response.data;
  },

  // PUT
  async updateProperty(id: number, data: Property): Promise<Property> {
    const response = await propertyApi.update(id, data);
    return response.data;
  },

  // PATCH
  async patchProperty(id: number, patches: PropertyPatch[]): Promise<Property> {
    const response = await propertyApi.patch(id, patches);
    return response.data;
  },

  // DELETE
  async deleteProperty(id: number): Promise<void> {
    await propertyApi.delete(id);
  }
};
```

### API Client Configuration

```typescript
// client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Variables

```env
VITE_API_BASE_URL=https://your-apigee-url.com/api
VITE_API_KEY=your-api-key-here
```


---

## Custom Hooks

### useProperties Hook

```typescript
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data: PropertyCreate) => {
    setLoading(true);
    try {
      const newProperty = await propertyService.createProperty(data);
      setProperties([...properties, newProperty]);
      return newProperty;
    } catch (err) {
      setError('Failed to create property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: number, data: Property) => {
    setLoading(true);
    try {
      const updated = await propertyService.updateProperty(id, data);
      setProperties(properties.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      setError('Failed to update property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: number) => {
    setLoading(true);
    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty
  };
};
```


---

## Error Handling Strategy

### Error Types

1. **Network Errors**: No connection to API
2. **Authentication Errors**: Invalid API key
3. **Validation Errors**: Invalid data submitted
4. **Not Found Errors**: Resource doesn't exist
5. **Server Errors**: API internal errors

### Error Display

```typescript
interface ErrorState {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'notfound' | 'server';
  details?: any;
}

// Error handling utility
export const handleApiError = (error: any): ErrorState => {
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection.',
      type: 'network'
    };
  }

  switch (error.response.status) {
    case 401:
    case 403:
      return {
        message: 'Authentication failed. Check your API key.',
        type: 'auth'
      };
    case 404:
      return {
        message: 'Resource not found.',
        type: 'notfound'
      };
    case 400:
      return {
        message: 'Invalid data submitted.',
        type: 'validation',
        details: error.response.data
      };
    default:
      return {
        message: 'Server error. Please try again later.',
        type: 'server'
      };
  }
};
```

### User Feedback

- Toast notifications for success/error
- Inline validation errors in forms
- Loading states during operations
- Confirmation dialogs for destructive actions
- Retry buttons for failed operations


---

## Styling Approach

### CSS Strategy

**Option 1: CSS Modules** (Recommended for MVP)
- Scoped styles per component
- No external dependencies
- Fast and simple

**Option 2: Tailwind CSS** (If time permits)
- Utility-first approach
- Rapid development
- Consistent design system

**Option 3: Plain CSS** (Fallback)
- Single global stylesheet
- Simple but harder to maintain

### Base Styles

```css
/* index.css */
:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-gray: #6b7280;
  --color-light: #f3f4f6;
  --color-dark: #1f2937;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --border-radius: 0.5rem;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {serif;
  line-height: 1.6;
  color: var(--color-dark);
  background-color: var(--color-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```


  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, s
-
--

## Implementation Checklist

### Phase 1: Foundation (Week 8, Days 1-2)

- [ ] Define TypeScript types for all entities
- [ ] Update API client with proper error handling
- [ ] Create utility functions (formatters, validators)
- [ ] Set up base CSS styles
- [ ] Create common components (Button, Card, Modal, etc.)

### Phase 2: Properties Module (Week 8, Days 3-4)

- [ ] Enhance PropertyList with filters and search
- [ ] Implement PropertyDetail (GET by ID)
- [ ] Complete PropertyForm (POST and PUT)
- [ ] Implement PropertyPatchForm (PATCH)
- [ ] Add delete confirmation dialog
- [ ] Test all 6 HTTP methods for properties

### Phase 3: Users Module (Week 8, Days 5-6)

- [ ] Enhance UserList
- [ ] Implement UserDetail (GET by ID)
- [ ] Complete UserForm (POST and PUT)
- [ ] Implement UserPatchForm (PATCH)
- [ ] Add delete confirmation
- [ ] Test all 6 HTTP methods for users

### Phase 4: Realtors Module (Week 9, Days 1-2)

- [ ] Enhance RealtorList
- [ ] Implement RealtorDetail (GET by ID)
- [ ] Complete RealtorForm (POST and PUT)
- [ ] Implement RealtorPatchForm (PATCH)
- [ ] Add delete confirmation
- [ ] Test all 6 HTTP methods for realtors

### Phase 5: Polish & Testing (Week 9, Days 3-4)

- [ ] Improve navigation and layout
- [ ] Add loading states everywhere
- [ ] Enhance error handling
- [ ] Add form validation
- [ ] Test all user flows
- [ ] Fix bugs and edge cases
- [ ] Responsive design adjustments

### Phase 6: Deployment (Week 9, Day 5)

- [ ] Build production bundle
- [ ] Configure AWS S3 bucket
- [ ] Enable static website hosting
- [ ] Upload build files
- [ ] Test deployed application
- [ ] Update APigee CORS settings if needed


---

## Testing Strategy

### Manual Testing Checklist

**For Each Entity (Properties, Users, Realtors):**

1. **GET All**
   - [ ] List displays all records
   - [ ] Empty state shows appropriate message
   - [ ] Loading state displays during fetch
   - [ ] Error state shows on failure

2. **GET by ID**
   - [ ] Detail view shows all fields correctly
   - [ ] Navigation from list to detail works
   - [ ] 404 error handled for non-existent ID
   - [ ] Back button returns to list

3. **POST (Create)**
   - [ ] Form validation works
   - [ ] Required fields enforced
   - [ ] Success message on creation
   - [ ] Redirects to list or detail after creation
   - [ ] New record appears in list

4. **PUT (Full Update)**
   - [ ] Form pre-fills with existing data
   - [ ] All fields can be updated
   - [ ] Validation works
   - [ ] Success message on update
   - [ ] Changes reflect in list and detail

5. **PATCH (Partial Update)**
   - [ ] Can select individual fields to update
   - [ ] Multiple patches can be added
   - [ ] Patch operations sent correctly
   - [ ] Success message on update
   - [ ] Changes reflect immediately

6. **DELETE**
   - [ ] Confirmation dialog appears
   - [ ] Cancel works correctly
   - [ ] Confirm deletes the record
   - [ ] Record removed from list
   - [ ] Success message shown

### Browser Testing

- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

### Responsive Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (optional, 375x667)


---

## Marking Scheme Alignment

### How This Design Meets Requirements

**2.14.1 Instantiate HttpClient object, pay attention to API key (1 mark)**
- ✅ Axios client configured in `api/client.ts`
- ✅ API key from environment variable
- ✅ Proper headers set

**2.14.2 Invoke all 6 methods provided in your API (6 × 3 = 18 marks)**

Properties (6 marks):
- ✅ GET all - PropertyList component
- ✅ GET by ID - PropertyDetail component
- ✅ POST - PropertyForm (create mode)
- ✅ PUT - PropertyForm (edit mode)
- ✅ PATCH - PropertyPatchForm component
- ✅ DELETE - Delete button with confirmation

Users (6 marks):
- ✅ GET all - UserList component
- ✅ GET by ID - UserDetail component
- ✅ POST - UserForm (create mode)
- ✅ PUT - UserForm (edit mode)
- ✅ PATCH - UserPatchForm component
- ✅ DELETE - Delete button with confirmation

Realtors (6 marks):
- ✅ GET all - RealtorList component
- ✅ GET by ID - RealtorDetail component
- ✅ POST - RealtorForm (create mode)
- ✅ PUT - RealtorForm (edit mode)
- ✅ PATCH - RealtorPatchForm component
- ✅ DELETE - Delete button with confirmation

**2.15 Overall (performance, readability, maintainability, usability, etc.) (2 marks)**
- ✅ Clean component structure
- ✅ TypeScript for type safety
- ✅ Reusable common components
- ✅ Consistent styling
- ✅ Good error handling
- ✅ User-friendly interface

**Total: 21 marks from frontend implementation**


---

## Key Features Summary

### Must-Have Features (MVP)

1. **Complete CRUD for 3 Entities**
   - All 6 HTTP methods working
   - Clear demonstration of each operation
   - Proper error handling

2. **User-Friendly Interface**
   - Intuitive navigation
   - Clear action buttons
   - Loading and error states
   - Confirmation dialogs

3. **APigee Integration**
   - API key authentication
   - Proper headers
   - Error handling for auth failures

4. **Form Validation**
   - Required field validation
   - Data type validation
   - User feedback on errors

5. **Responsive Layout**
   - Works on desktop and tablet
   - Clean, professional appearance

### Nice-to-Have Features (If Time Permits)

1. **Advanced Filtering**
   - Multiple filter criteria
   - Search across fields
   - Sort options

2. **Pagination**
   - Handle large datasets
   - Page size options

3. **Toast Notifications**
   - Success/error toasts
   - Auto-dismiss

4. **Image Upload**
   - Property images
   - User avatars

5. **Dark Mode**
   - Theme toggle
   - Persistent preference

6. **Export Data**
   - CSV export
   - Print view


---

## AWS S3 Deployment Guide

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ folder
```

### S3 Configuration

1. **Create S3 Bucket**
   - Bucket name: `real-estate-client-[your-name]`
   - Region: Same as your API (e.g., us-east-1)
   - Uncheck "Block all public access"

2. **Enable Static Website Hosting**
   - Properties → Static website hosting → Enable
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

3. **Bucket Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::real-estate-client-[your-name]/*"
    }
  ]
}
```

4. **Upload Files**

```bash
# Using AWS CLI
aws s3 sync dist/ s3://real-estate-client-[your-name]/ --delete

# Or use AWS Console to upload dist/ contents
```

5. **Access Your App**
   - URL: `http://real-estate-client-[your-name].s3-website-us-east-1.amazonaws.com`

### CORS Configuration

If you encounter CORS issues, ensure APigee has proper CORS headers:

- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
- Access-Control-Allow-Headers: Content-Type, x-api-key


---

## Common Pitfalls & Solutions

### 1. CORS Errors

**Problem:** Browser blocks API requests due to CORS policy

**Solution:**

- Ensure APigee proxy has CORS policy configured
- Add proper headers in APigee
- Test API directly with Postman first

### 2. API Key Not Working

**Problem:** 401/403 errors from APigee

**Solution:**

- Verify API key is correct in `.env`
- Check header name matches APigee configuration
- Ensure API key is associated with correct product
- Verify developer app is approved

### 3. PATCH Not Working

**Problem:** PATCH requests fail or don't update

**Solution:**format: `[{ "op": "replace", "path": "/field", "value": "new" }]`

- Set Content-Type to `application/json-patch+json`
- Ensure path starts with `/`
- Test with Postman first

### 4. Date Formatting Issues

**Problem:** Dates not displaying correctly

**Solution:**
```typescript
// Format date for display
const formatDate = (dateString: string) => { {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date for API
const formatDateForApi = (date: Date) => {
  return date.toISOString();
};
```

### 5. Form Validation Not Working

**Problem:** Invalid data submitted to API

**Solution:**
- Implement client-side validation
- Show validation errors inline
- Disable submit button until valid

### 6. State Not Updating After API Call

**Problem:** UI doesn't reflect changes after create/update/delete

**Solution:**
- Refetch data after mutations
- Update local state optimistically
- Use proper React state management
- Ensure component re-renders


- Add HTML5 validation attr
  return new Date(dateString).toLocaleDateString(
- Use correct JSON Pat
---


## Presentation Tips

### Demo Flow

1. **Introduction (1 minute)**
   - Show architecture diagram
   - Explain APigee integration
   - Mention React + TypeScript stack

2. **Properties Demo (3 minl)
   - Click on property to view details (GET by ID)
   - Create new property (POST)
   - Edit property (PUT)
   - Quick edit with PATCH
   - Delete property with confirmation

3. **Users Demo (2 minutes)**
   - Show all 6 operations quickly
   - Highlight any unique features

4. **Realtors Demo (2 minutes)**
   - Show all 6 operations quickly
   - Show relationship with properties

5. **Technical Highlights (2 minutes)**
   - Show API key configuration
   - Show error handling
   - Show form validation
   - Mention S3 deployment

### Questions to Prepare For

1. **How does the API key authentication work?**
   - Stored in environment variable
   - Sent in x-api-key header
   - Configured in axios client

2. **What's the difference between PUT and PATCH?**
   - PUT replaces entire resource
   - PATCH updates specific fields
   - Show both in demo

3. **How do you handle errors?**
   - Try-catch blocks
   - Error state in components
   - User-friendly error messages
   - Retry options

4. **Why React and TypeScript?**
   - React for component-based UI
   - TypeScript for type safety
   - Better developer experience
   - Catches errors at compile time

5. **How is the app deployed?**
   - Built with Vite
   - Static files uploaded to S3
   - S3 configured for static hosting
   - Accessible via S3 website URL

utes)**
   - Show list v
---


## Documentation Requirements

### Architecture Diagram

Create a diagram showing:
```
User Browser
    ↓
React App (S3)
    ↓
APigee Gateway
    ↓
Real Estate API (ECS Fargate)
    ↓
RDS Database
```

Include:

- Component breakdown
- Data flow
- API endpoints used
- Authentication flow

### Code Documentation

Document in presentation:

- Project structure
- Key components
- API integration approach
- State management strategy
- Error handling approach

### README Updates

Update `RealEstateClient/README.md` with:

- Setup instructions
- Environment variables needed
- How to run locally
- How to build for production
- Deployment instructions
- API endpoint documentation

---

## Success Criteria

### Functional Requirements

✅ All 18 API methods working (6 × 3 entities)
✅ Proper API key authentication
✅ Error handling for all operations
✅ Form validation
✅ Loading states
✅ Confirmation dialogs
✅ Responsive design
✅ Deployed to S3

### Non-Functional Requirements

✅ Clean, maintainable code
✅ TypeScript types defined
✅ Reusable components
✅ Consistent styling
✅ Good user experience
✅ Professional appearance
✅ Well-documented

### Marking Scheme Achievement

- 2.14.1 HttpClient with API key: **1 mark** ✅
- 2.14.2 All 6 methods × 3 entities: **18 marks** ✅
- 2.15 Overall quality: **2 marks** ✅
- **Total: 21 marks** ✅

---

## Final Notes

This design provides a complete roadmap for Student 3 to build a professional, functional React application that demonstrates all required HTTP methods for the academic project. The focus is on:

1. **Academic compliance** - Meeting all marking criteria
2. **Simplicity** - MVP approach, no over-engineering
3. **Clarity** - Clear demonstration of each operation
4. **Quality** - Professional appearance and good UX
5. **Completeness** - All 18 endpoints working

Follow the implementation checklist, test thoroughly, and you'll have a solid frontend application that showcases your full-stack development skills.

Good luck with your implementation! 🚀
