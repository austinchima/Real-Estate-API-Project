import { useState } from 'react';
import { Property } from '../types';
import { propertyService } from '../services';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

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
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        {property ? 'Update' : 'Create'} Property
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          {property ? 'Update' : 'Create'} Property
        </Button>
      </Box>
    </Container>
  );
};