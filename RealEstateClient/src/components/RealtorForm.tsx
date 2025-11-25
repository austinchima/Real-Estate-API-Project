import { useState } from 'react';
import type { Realtor } from '../types';
import { realtorService } from '../services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select } from './ui/select';

interface RealtorFormProps {
  realtor?: Realtor;
  onSave?: (realtor: Realtor) => void;
  onCancel?: () => void;
}

export const RealtorForm = ({ realtor, onSave, onCancel }: RealtorFormProps) => {
  const [formData, setFormData] = useState({
    firstName: realtor?.firstName || '',
    lastName: realtor?.lastName || '',
    email: realtor?.email || '',
    phoneNumber: realtor?.phoneNumber || '',
    licenseNumber: realtor?.licenseNumber || '',
    agency: realtor?.agency || '',
    yearsOfExperience: realtor?.yearsOfExperience || 0,
    specialization: realtor?.specialization || 'Residential',
    isActive: realtor?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const savedRealtor = realtor?.id 
        ? await realtorService.updateRealtor(realtor.id, { ...formData, id: realtor.id })
        : await realtorService.createRealtor(formData);
      
      onSave?.(savedRealtor);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save realtor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{realtor ? 'Edit Realtor' : 'Add New Realtor'}</CardTitle>
        <CardDescription>Enter realtor information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency">Agency *</Label>
              <Input id="agency" value={formData.agency} onChange={(e) => setFormData({...formData, agency: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
              <Input id="yearsOfExperience" type="number" min="0" value={formData.yearsOfExperience} onChange={(e) => setFormData({...formData, yearsOfExperience: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select id="specialization" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Luxury">Luxury</option>
                <option value="Investment">Investment</option>
                <option value="Land">Land</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Status *</Label>
              <Select id="isActive" value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} required>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : realtor ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};