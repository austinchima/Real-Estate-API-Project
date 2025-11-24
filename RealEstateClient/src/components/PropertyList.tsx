import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
} from '@mui/icons-material';
import { propertyService } from '../services';
import type { Property } from '../types/index';
import { PropertyForm } from './PropertyForm';

export const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; property: Property | null }>({
    open: false,
    property: null,
  });
  const [formDialog, setFormDialog] = useState<{ open: boolean; property: Property | null }>({
    open: false,
    property: null,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (property: Property) => {
    setDeleteDialog({ open: true, property });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.property) {
      try {
        await propertyService.deleteProperty(deleteDialog.property.id);
        setProperties(properties.filter((p) => p.id !== deleteDialog.property!.id));
        setDeleteDialog({ open: false, property: null });
      } catch (err) {
        console.error('Error deleting property:', err);
        setError('Failed to delete property');
      }
    }
  };

  const handleFormSave = (savedProperty: Property) => {
    if (formDialog.property) {
      setProperties(properties.map(p => p.id === savedProperty.id ? savedProperty : p));
    } else {
      setProperties([...properties, savedProperty]);
    }
    setFormDialog({ open: false, property: null });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'sold':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Properties
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormDialog({ open: true, property: null })}>
          Add Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" noWrap>
                    {property.address}
                  </Typography>
                  <Chip label={property.status} color={getStatusColor(property.status) as any} size="small" />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {property.city}, {property.state} {property.zipCode}
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" gutterBottom>
                  ${property.price.toLocaleString()}
                </Typography>

                <Box display="flex" gap={2} mb={2}>
                  <Box display="flex" alignItems="center">
                    <BedIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{property.bedrooms} bed</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <BathtubIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{property.bathrooms} bath</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {property.squareFeet} sq ft • {property.propertyType}
                </Typography>

                <Typography variant="body2" color="text.secondary" noWrap>
                  {property.description}
                </Typography>
              </CardContent>

              <CardActions>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setFormDialog({ open: true, property })}>
                  Edit
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(property)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {properties.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No properties found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Get started by adding your first property
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Property
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, property: null })}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.property?.address}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, property: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Property Form Dialog */}
      <PropertyForm
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, property: null })}
        onSave={handleFormSave}
        property={formDialog.property}
      />
    </Box>
  );
};