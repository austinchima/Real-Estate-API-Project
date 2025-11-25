# Implementation Guide for Student 3

## Quick Start Checklist

### Day 1: Setup & Types (2-3 hours)

1. **Define TypeScript Types**
   - Create `src/types/property.ts`
   - Create `src/types/user.ts`
   - Create `src/types/realtor.ts`
   - Create `src/types/common.ts`

2. **Update API Layer**
   - Add PATCH method to all API files
   - Add proper error handling
   - Test with Postman/Thunder Client

3. **Create Common Components**
   - Button component
   - Card component
   - Modal component
   - LoadingSpinner component
   - ErrorMessage component

### Day 2-3: Properties Module (6-8 hours)

4. **Enhance PropertyList**
   - Add search functionality
   - Add filters
   - Improve styling

5. **Create PropertyDetail**
   - Fetch property by ID
   - Display all fields
   - Add action buttons

6. **Complete PropertyForm**
   - Support both create and edit modes
   - Add validation
   - Handle form submission

7. **Create PropertyPatchForm**
   - Field selector
   - Patch builder
   - Submit patches

### Day 4-5: Users & Realtors (6-8 hours)

8. **Implement User Components**
   - UserList, UserDetail, UserForm, UserPatchForm
   - Follow same pattern as Properties

9. **Implement Realtor Components**
   - RealtorList, RealtorDetail, RealtorForm, RealtorPatchForm
   - Follow same pattern as Properties

### Day 6: Polish & Testing (4-6 hours)

10. **Improve UX**
    - Add loading states
    - Improve error handling
    - Add confirmation dialogs
    - Enhance styling

11. **Test Everything**
    - Test all 18 endpoints
    - Test error scenarios
    - Test on different browsers

### Day 7: Deployment (2-3 hours)

12. **Deploy to S3**
    - Build production bundle
    - Configure S3 bucket
    - Upload files
    - Test deployed app

---

## Code Examples

### 1. TypeScript Types

```typescript
// src/types/property.ts
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

export interface PropertyCreate extends Omit<Property, 'id'> {}

export interface PropertyUpdate extends Property {}

export interface PatchOperation {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: any;
}
```


### 2. API Layer with PATCH

```typescript
// src/api/properties.ts
import apiClient from './client';
import type { Property, PropertyCreate, PatchOperation } from '../types';

export const propertyApi = {
  getAll: () => apiClient.get<Property[]>('/properties'),
  
  getById: (id: number) => apiClient.get<Property>(`/properties/${id}`),
  
  create: (data: PropertyCreate) => apiClient.post<Property>('/properties', data),
  
  update: (id: number, data: Property) => 
    apiClient.put<Property>(`/properties/${id}`, data),
  
  patch: (id: number, patches: PatchOperation[]) => 
    apiClient.patch<Property>(`/properties/${id}`, patches, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    }),
  
  delete: (id: number) => apiClient.delete(`/properties/${id}`)
};
```

### 3. Common Button Component

```typescript
// src/components/common/Button.tsx
import React from 'react';
import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  children
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

### 4. Loading Spinner Component

```typescript
// src/components/common/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};
```

```css
/* src/components/common/LoadingSpinner.css */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```


### 5. Confirm Dialog Component

```typescript
// src/components/common/ConfirmDialog.tsx
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

### 6. Enhanced PropertyDetail Component

```typescript
// src/components/properties/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import type { Property } from '../../types';
import './PropertyDetail.css';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertyService.getProperty(Number(id));
      setProperty(data);
    } catch (err) {
      setError('Failed to load property details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await propertyService.deleteProperty(Number(id));
      navigate('/properties');
    } catch (err) {
      setError('Failed to delete property');
      console.error(err);
    }
    setShowDeleteDialog(false);
  };

  if (loading) return <LoadingSpinner message="Loading property..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProperty} />;
  if (!property) return <ErrorMessage message="Property not found" />;

  return (
    <div className="property-detail">
      <button onClick={() => navigate('/properties')} className="back-button">
        ← Back to Properties
      </button>

      <div className="property-card">
        <h1>{property.address}</h1>
        <p className="location">{property.city}, {property.state} {property.zipCode}</p>

        <div className="property-info">
          <div className="info-row">
            <span className="label">Price:</span>
            <span className="value">${property.price.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`badge badge-${property.status.toLowerCase()}`}>
              {property.status}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Type:</span>
            <span className="value">{property.propertyType}</span>
          </div>
          <div className="info-row">
            <span className="label">Bedrooms:</span>
            <span className="value">{property.bedrooms}</span>
          </div>
          <div className="info-row">
            <span className="label">Bathrooms:</span>
            <span className="value">{property.bathrooms}</span>
          </div>
          <div className="info-row">
            <span className="label">Square Feet:</span>
            <span className="value">{property.squareFeet.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="label">Listed Date:</span>
            <span className="value">
              {new Date(property.listedDate).toLocaleDateString()}
            </span>
          </div>
          {property.realtorId && (
            <div className="info-row">
              <span className="label">Realtor ID:</span>
              <span className="value">{property.realtorId}</span>
            </div>
          )}
        </div>

        {property.description && (
          <div className="property-description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>
        )}

        <div className="action-buttons">
          <Button 
            variant="primary" 
            onClick={() => navigate(`/properties/${id}/edit`)}
          >
            Edit Property
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/properties/${id}/patch`)}
          >
            Quick Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Property
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${property.address}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete Property"
      />
    </div>
  );
};
```


### 7. PropertyForm Component (Create & Edit)

```typescript
// src/components/properties/PropertyForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Property, PropertyCreate } from '../../types';
import './PropertyForm.css';

export const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<PropertyCreate>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    propertyType: 'House',
    status: 'Available',
    realtorId: undefined,
    listedDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await propertyService.getProperty(Number(id));
      setFormData(data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'bedrooms', 'bathrooms', 'squareFeet', 'realtorId'].includes(name)
        ? Number(value)
        : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.bedrooms < 0) newErrors.bedrooms = 'Bedrooms cannot be negative';
    if (formData.bathrooms < 0) newErrors.bathrooms = 'Bathrooms cannot be negative';
    if (formData.squareFeet <= 0) newErrors.squareFeet = 'Square feet must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await propertyService.updateProperty(Number(id), formData as Property);
      } else {
        await propertyService.createProperty(formData);
      }
      navigate('/properties');
    } catch (err) {
      setError(isEditMode ? 'Failed to update property' : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <LoadingSpinner />;

  return (
    <div className="property-form-container">
      <button onClick={() => navigate('/properties')} className="back-button">
        ← Back to Properties
      </button>

      <div className="form-card">
        <h1>{isEditMode ? 'Edit Property' : 'Create New Property'}</h1>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'error' : ''}
              />
              {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms *</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                className={errors.bedrooms ? 'error' : ''}
              />
              {errors.bedrooms && <span className="error-text">{errors.bedrooms}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms *</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                className={errors.bathrooms ? 'error' : ''}
              />
              {errors.bathrooms && <span className="error-text">{errors.bathrooms}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="squareFeet">Square Feet *</label>
            <input
              type="number"
              id="squareFeet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              min="0"
              className={errors.squareFeet ? 'error' : ''}
            />
            {errors.squareFeet && <span className="error-text">{errors.squareFeet}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="realtorId">Realtor ID (optional)</label>
            <input
              type="number"
              id="realtorId"
              name="realtorId"
              value={formData.realtorId || ''}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="listedDate">Listed Date *</label>
            <input
              type="date"
              id="listedDate"
              name="listedDate"
              value={formData.listedDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/properties')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="success" 
              loading={loading}
              disabled={loading}
            >
              {isEditMode ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
```


### 8. PropertyPatchForm Component

```typescript
// src/components/properties/PropertyPatchForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Property, PatchOperation } from '../../types';
import './PropertyPatchForm.css';

export const PropertyPatchForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [patches, setPatches] = useState<PatchOperation[]>([]);
  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchableFields = [
    { value: 'price', label: 'Price', type: 'number' },
    { value: 'status', label: 'Status', type: 'select', options: ['Available', 'Pending', 'Sold'] },
    { value: 'bedrooms', label: 'Bedrooms', type: 'number' },
    { value: 'bathrooms', label: 'Bathrooms', type: 'number' },
    { value: 'description', label: 'Description', type: 'text' },
    { value: 'realtorId', label: 'Realtor ID', type: 'number' }
  ];

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await propertyService.getProperty(Number(id));
      setProperty(data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const addPatch = () => {
    if (!selectedField || fieldValue === '') return;

    const field = patchableFields.find(f => f.value === selectedField);
    if (!field) return;

    let value: any = fieldValue;
    if (field.type === 'number') {
      value = Number(fieldValue);
    }

    const newPatch: PatchOperation = {
      op: 'replace',
      path: `/${selectedField}`,
      value
    };

    setPatches([...patches, newPatch]);
    setSelectedField('');
    setFieldValue('');
  };

  const removePatch = (index: number) => {
    setPatches(patches.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (patches.length === 0 || !id) return;

    setLoading(true);
    setError(null);

    try {
      await propertyService.patchProperty(Number(id), patches);
      navigate(`/properties/${id}`);
    } catch (err) {
      setError('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !property) return <LoadingSpinner />;
  if (!property) return <div>Property not found</div>;

  const selectedFieldConfig = patchableFields.find(f => f.value === selectedField);

  return (
    <div className="patch-form-container">
      <button onClick={() => navigate(`/properties/${id}`)} className="back-button">
        ← Back to Property
      </button>

      <div className="form-card">
        <h1>Quick Edit Property</h1>
        <p className="property-name">{property.address}</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="patch-builder">
          <h3>Add Field to Update</h3>
          
          <div className="form-group">
            <label>Select Field</label>
            <select
              value={selectedField}
              onChange={(e) => {
                setSelectedField(e.target.value);
                setFieldValue('');
              }}
            >
              <option value="">-- Select a field --</option>
              {patchableFields.map(field => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          {selectedField && selectedFieldConfig && (
            <div className="form-group">
              <label>New {selectedFieldConfig.label}</label>
              {selectedFieldConfig.type === 'select' ? (
                <select
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {selectedFieldConfig.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={selectedFieldConfig.type}
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder={`Enter new ${selectedFieldConfig.label.toLowerCase()}`}
                />
              )}
            </div>
          )}

          <Button 
            variant="secondary" 
            onClick={addPatch}
            disabled={!selectedField || fieldValue === ''}
          >
            + Add Field
          </Button>
        </div>

        {patches.length > 0 && (
          <div className="pending-patches">
            <h3>Pending Changes</h3>
            <ul>
              {patches.map((patch, index) => {
                const fieldName = patch.path.substring(1);
                const fieldConfig = patchableFields.find(f => f.value === fieldName);
                return (
                  <li key={index}>
                    <span className="patch-field">{fieldConfig?.label}:</span>
                    <span className="patch-value">{String(patch.value)}</span>
                    <button 
                      onClick={() => removePatch(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/properties/${id}`)}
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSubmit}
            disabled={patches.length === 0 || loading}
            loading={loading}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 9. Updated App.tsx with All Routes

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  PropertyList,
  PropertyDetail,
  PropertyForm,
  PropertyPatchForm,
  UserList,
  UserDetail,
  UserForm,
  UserPatchForm,
  RealtorList,
  RealtorDetail,
  RealtorForm,
  RealtorPatchForm
} from './components';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="main-nav">
          <div className="nav-brand">Real Estate App</div>
          <div className="nav-links">
            <Link to="/properties">Properties</Link>
            <Link to="/users">Users</Link>
            <Link to="/realtors">Realtors</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            {/* Properties */}
            <Route path="/" element={<PropertyList />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/properties/:id/edit" element={<PropertyForm />} />
            <Route path="/properties/:id/patch" element={<PropertyPatchForm />} />

            {/* Users */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            <Route path="/users/:id/patch" element={<UserPatchForm />} />

            {/* Realtors */}
            <Route path="/realtors" element={<RealtorList />} />
            <Route path="/realtors/new" element={<RealtorForm />} />
            <Route path="/realtors/:id" element={<RealtorDetail />} />
            <Route path="/realtors/:id/edit" element={<RealtorForm />} />
            <Route path="/realtors/:id/patch" element={<RealtorPatchForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```


---

## Testing Checklist

### Properties Testing

```bash
# Test all 6 HTTP methods for Properties

1. GET All Properties
   - Navigate to /properties
   - Verify list displays
   - Check loading state
   - Verify data matches API

2. GET Property by ID
   - Click on a property card
   - Navigate to /properties/{id}
   - Verify all fields display correctly
   - Check back button works

3. POST (Create Property)
   - Click "+ Add Property"
   - Fill all required fields
   - Submit form
   - Verify redirect to list
   - Verify new property appears

4. PUT (Update Property)
   - Go to property detail
   - Click "Edit Property"
   - Modify multiple fields
   - Submit form
   - Verify changes saved

5. PATCH (Partial Update)
   - Go to property detail
   - Click "Quick Edit"
   - Select field (e.g., Price)
   - Enter new value
   - Apply changes
   - Verify only that field updated

6. DELETE Property
   - Go to property detail or list
   - Click "Delete"
   - Confirm deletion
   - Verify property removed from list
```

### Users Testing

Repeat the same 6 tests for Users:
- GET all users
- GET user by ID
- POST create user
- PUT update user
- PATCH partial update user
- DELETE user

### Realtors Testing

Repeat the same 6 tests for Realtors:
- GET all realtors
- GET realtor by ID
- POST create realtor
- PUT update realtor
- PATCH partial update realtor
- DELETE realtor

---

## Common CSS Styles

```css
/* src/index.css - Base styles */
:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-gray: #6b7280;
  --color-light: #f3f4f6;
  --color-dark: #1f2937;
  --spacing: 1rem;
  --border-radius: 0.5rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--color-dark);
  background-color: var(--color-light);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-success {
  background: var(--color-success);
  color: white;
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-secondary {
  background: var(--color-gray);
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.back-button:hover {
  text-decoration: underline;
}

.error-banner {
  background: #fee;
  color: var(--color-danger);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.form-group input.error,
.form-group select.error {
  border-color: var(--color-danger);
}

.error-text {
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-available {
  background: #d1fae5;
  color: #065f46;
}

.badge-pending {
  background: #fed7aa;
  color: #92400e;
}

.badge-sold {
  background: #e5e7eb;
  color: #374151;
}
```

---

## Deployment Commands

```bash
# 1. Build the application
npm run build

# 2. Test the build locally (optional)
npm run preview

# 3. Deploy to S3 using AWS CLI
aws s3 sync dist/ s3://your-bucket-name/ --delete

# 4. Set bucket policy for public access
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json

# 5. Enable static website hosting
aws s3 website s3://your-bucket-name/ --index-document index.html --error-document index.html
```

### bucket-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

## Final Checklist Before Submission

- [ ] All 18 endpoints working (6 × 3 entities)
- [ ] API key configured correctly
- [ ] All forms have validation
- [ ] Loading states on all async operations
- [ ] Error handling everywhere
- [ ] Confirmation dialogs for delete
- [ ] Responsive design works
- [ ] No console errors
- [ ] Deployed to S3 successfully
- [ ] Tested on multiple browsers
- [ ] Code is clean and commented
- [ ] README updated with setup instructions
- [ ] Architecture diagram created
- [ ] Presentation prepared

---

## Tips for Success

1. **Start Simple**: Get one entity fully working before moving to others
2. **Test Often**: Test each HTTP method immediately after implementing
3. **Use Postman**: Test API endpoints directly before integrating
4. **Console Logging**: Use console.log to debug API responses
5. **Error First**: Implement error handling from the start
6. **Reuse Code**: Copy-paste and modify for similar components
7. **Ask for Help**: Don't hesitate to ask teammates if stuck
8. **Time Management**: Leave buffer time for unexpected issues
9. **Document**: Comment your code as you write it
10. **Practice Demo**: Run through your demo multiple times

Good luck with your implementation! 🚀
