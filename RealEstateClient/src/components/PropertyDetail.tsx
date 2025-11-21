import { useState, useEffect } from 'react';
import { Property } from '../types';
import { propertyService } from '../services';
import { Container, Typography, Card, CardContent, CircularProgress, Box, Chip } from '@mui/material';

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

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (!property) return <Typography variant="h6" align="center">Property not found</Typography>;

  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {property.address}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {property.city}, {property.state} {property.zipCode}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${property.price.toLocaleString()}
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <Chip label={`${property.bedrooms} bed`} />
            <Chip label={`${property.bathrooms} bath`} />
            <Chip label={`${property.squareFeet} sq ft`} />
          </Box>
          <Typography variant="body1" paragraph>
            <strong>Type:</strong> {property.propertyType}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Status:</strong> {property.status}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {property.description}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};