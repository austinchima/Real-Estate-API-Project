import { useState, useEffect } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';

interface PropertyDetailProps {
  propertyId: number;
}

export const PropertyDetail = ({ propertyId }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getProperty(propertyId);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>{property.address}</h2>
      <p>{property.city}, {property.state} {property.zipCode}</p>
      <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
      <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
      <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
      <p><strong>Square Feet:</strong> {property.squareFeet}</p>
      <p><strong>Type:</strong> {property.propertyType}</p>
      <p><strong>Status:</strong> {property.status}</p>
      <p><strong>Description:</strong> {property.description}</p>
    </div>
  );
};