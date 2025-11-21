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
    propertyType: property?.propertyType || '',
    status: property?.status || '',
    realtorId: property?.realtorId || 0,
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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px' }}>
      <div>
        <label>Address:</label>
        <input 
          type="text" 
          value={formData.address} 
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>City:</label>
        <input 
          type="text" 
          value={formData.city} 
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>Price:</label>
        <input 
          type="number" 
          value={formData.price} 
          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          required 
        />
      </div>
      <div>
        <label>Bedrooms:</label>
        <input 
          type="number" 
          value={formData.bedrooms} 
          onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
          required 
        />
      </div>
      <button type="submit">{property ? 'Update' : 'Create'} Property</button>
    </form>
  );
};