import { useState, useEffect } from 'react';
import { Property } from '../types';
import { propertyService } from '../services';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Box } from '@mui/material';

export const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Properties
      </Typography>
      <Grid container spacing={3}>
        {properties.map(property => (
          <Grid item xs={12} md={6} lg={4} key={property.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {property.address}
                </Typography>
                <Typography color="textSecondary">
                  {property.city}, {property.state} {property.zipCode}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${property.price.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  {property.bedrooms} bed, {property.bathrooms} bath
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};}