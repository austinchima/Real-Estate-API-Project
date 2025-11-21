import { useState, useEffect } from 'react';
import { Realtor } from '../types';
import { realtorService } from '../services';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Box, Chip } from '@mui/material';

export const RealtorList = () => {
  const [realtors, setRealtors] = useState<Realtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealtors = async () => {
      try {
        const data = await realtorService.getAllRealtors();
        setRealtors(data);
      } catch (error) {
        console.error('Error fetching realtors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtors();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Realtors
      </Typography>
      <Grid container spacing={3}>
        {realtors.map(realtor => (
          <Grid item xs={12} md={6} lg={4} key={realtor.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {realtor.firstName} {realtor.lastName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {realtor.agency}
                </Typography>
                <Typography variant="body2">
                  License: {realtor.licenseNumber}
                </Typography>
                <Typography variant="body2">
                  Experience: {realtor.yearsOfExperience} years
                </Typography>
                <Box mt={1}>
                  <Chip 
                    label={realtor.isActive ? 'Active' : 'Inactive'} 
                    color={realtor.isActive ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};