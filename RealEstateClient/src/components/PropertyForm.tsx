import { useState } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';

interface PropertyFormProps {
  property?: Property;
  onSave?: (property: Property) => void;
  onCancel?: () => void;
}

export const PropertyForm = ({ property, onSave, onCancel }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || '',
    zipCode: property?.zipCode || '',
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    squareFeet: property?.squareFeet || 0,
    propertyType: property?.propertyType || 'House',
    status: property?.status || 'Available',
    realtorId: property?.realtorId || null,
    description: property?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const savedProperty = property?.id 
        ? await propertyService.updateProperty(property.id, { ...formData, id: property.id, listedDate: property.listedDate })
        : await propertyService.createProperty({ ...formData, listedDate: new Date().toISOString() });
      
      onSave?.(savedProperty);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{property ? 'Edit Property' : 'Add New Property'}</CardTitle>
        <CardDescription>Enter property details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input id="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input id="price" type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet *</Label>
              <Input id="squareFeet" type="number" min="0" value={formData.squareFeet} onChange={(e) => setFormData({...formData, squareFeet: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input id="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input id="bathrooms" type="number" min="0" step="0.5" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select id="propertyType" value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} required>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Land">Land</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required>
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : property ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};