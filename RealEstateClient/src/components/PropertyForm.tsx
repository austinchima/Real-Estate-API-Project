import { useState } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';

interface PropertyFormProps {
  property?: Property;
  onSave?: (property: Property) => void;
}

export const PropertyForm = ({ property, onSave }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || '',
    zipCode: property?.zipCode || '',
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    squareFeet: property?.squareFeet || 0,
    propertyType: property?.propertyType || 'Single Family',
    status: property?.status || 'Available',
    realtorId: property?.realtorId || 1,
    description: property?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedProperty = property?.id 
        ? await propertyService.updateProperty(property.id, { ...formData, id: property.id, listedDate: property.listedDate })
        : await propertyService.createProperty({ ...formData, listedDate: new Date().toISOString() });
      
      onSave?.(savedProperty);
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {property ? 'Update Property' : 'Add New Property'}
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          margin: '0'
        }}>
          {property ? 'Update property information' : 'Fill in the details to list a new property'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Property Address</label>
          <input 
            type="text" 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Enter full address"
            required 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>City</label>
            <input 
              type="text" 
              value={formData.city} 
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="City"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>State</label>
            <input 
              type="text" 
              value={formData.state} 
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="State"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>ZIP Code</label>
            <input 
              type="text" 
              value={formData.zipCode} 
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="ZIP"
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price ($)</label>
            <input 
              type="number" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Property price"
              min="0"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Square Feet</label>
            <input 
              type="number" 
              value={formData.squareFeet} 
              onChange={(e) => setFormData({...formData, squareFeet: Number(e.target.value)})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Square footage"
              min="0"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Bedrooms</label>
            <input 
              type="number" 
              value={formData.bedrooms} 
              onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Beds"
              min="0"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Bathrooms</label>
            <input 
              type="number" 
              step="0.5"
              value={formData.bathrooms} 
              onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Baths"
              min="0"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Realtor ID</label>
            <input 
              type="number" 
              value={formData.realtorId} 
              onChange={(e) => setFormData({...formData, realtorId: Number(e.target.value)})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Realtor ID"
              min="1"
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Property Type</label>
            <select 
              value={formData.propertyType} 
              onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              required
            >
              <option value="Single Family">Single Family</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              required
            >
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
              <option value="Off Market">Off Market</option>
            </select>
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Property description, features, and highlights..."
          />
        </div>

        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          {property ? '✓ Update Property' : '+ Add Property'}
        </button>
      </form>
    </div>
  );
};