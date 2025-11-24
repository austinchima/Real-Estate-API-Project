import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Rating,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { realtorService } from '../services';
import type { Realtor } from '../types/index';
import { RealtorForm } from './RealtorForm';

export const RealtorList: React.FC = () => {
  const [realtors, setRealtors] = useState<Realtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; realtor: Realtor | null }>({
    open: false,
    realtor: null,
  });
  const [formDialog, setFormDialog] = useState<{ open: boolean; realtor: Realtor | null }>({
    open: false,
    realtor: null,
  });

  useEffect(() => {
    fetchRealtors();
  }, []);

  const fetchRealtors = async () => {
    try {
      setLoading(true);
      const data = await realtorService.getAllRealtors();
      setRealtors(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch realtors');
      console.error('Error fetching realtors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (realtor: Realtor) => {
    setDeleteDialog({ open: true, realtor });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.realtor) {
      try {
        await realtorService.deleteRealtor(deleteDialog.realtor.id);
        setRealtors(realtors.filter((r) => r.id !== deleteDialog.realtor!.id));
        setDeleteDialog({ open: false, realtor: null });
      } catch (err) {
        console.error('Error deleting realtor:', err);
        setError('Failed to delete realtor');
      }
    }
  };

  const handleFormSave = (savedRealtor: Realtor) => {
    if (formDialog.realtor) {
      setRealtors(realtors.map(r => r.id === savedRealtor.id ? savedRealtor : r));
    } else {
      setRealtors([...realtors, savedRealtor]);
    }
    setFormDialog({ open: false, realtor: null });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getExperienceLevel = (years: number) => {
    if (years < 2) return { label: 'New', color: 'info' };
    if (years < 5) return { label: 'Experienced', color: 'primary' };
    if (years < 10) return { label: 'Senior', color: 'warning' };
    return { label: 'Expert', color: 'success' };
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
          Realtors
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormDialog({ open: true, realtor: null })}>
          Add Realtor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {realtors.map((realtor) => (
          <Grid item xs={12} sm={6} md={4} key={realtor.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    {getInitials(realtor.firstName, realtor.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {realtor.firstName} {realtor.lastName}
                    </Typography>
                    <Chip
                      label={realtor.isActive ? 'Active' : 'Inactive'}
                      color={realtor.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {realtor.email}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {realtor.phoneNumber}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {realtor.agency}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  <strong>License:</strong> {realtor.licenseNumber}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Experience:</strong> {realtor.yearsOfExperience} years
                  </Typography>
                  <Chip
                    label={getExperienceLevel(realtor.yearsOfExperience).label}
                    color={getExperienceLevel(realtor.yearsOfExperience).color as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  <strong>Specialization:</strong> {realtor.specialization}
                </Typography>
              </CardContent>

              <CardActions>
                <Button size="small" startIcon={<EditIcon />} onClick={() => setFormDialog({ open: true, realtor })}>
                  Edit
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(realtor)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {realtors.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No realtors found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Get started by adding your first realtor
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Realtor
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, realtor: null })}>
        <DialogTitle>Delete Realtor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.realtor?.firstName} {deleteDialog.realtor?.lastName}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, realtor: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Realtor Form Dialog */}
      <RealtorForm
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, realtor: null })}
        onSave={handleFormSave}
        realtor={formDialog.realtor}
      />
    </Box>
  );
};