import { useState } from 'react';
import  type { Realtor } from '../types';
import { realtorService } from '../services';

interface RealtorFormProps {
  realtor?: Realtor;
  onSave?: (realtor: Realtor) => void;
}

export const RealtorForm = ({ realtor, onSave }: RealtorFormProps) => {
  const [formData, setFormData] = useState({
    firstName: realtor?.firstName || '',
    lastName: realtor?.lastName || '',
    email: realtor?.email || '',
    phoneNumber: realtor?.phoneNumber || '',
    licenseNumber: realtor?.licenseNumber || '',
    agency: realtor?.agency || '',
    yearsOfExperience: realtor?.yearsOfExperience || 0,
    specialization: realtor?.specialization || '',
    isActive: realtor?.isActive ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedRealtor = realtor?.id 
        ? await realtorService.updateRealtor(realtor.id, { ...formData, id: realtor.id })
        : await realtorService.createRealtor(formData);
      
      onSave?.(savedRealtor);
    } catch (error) {
      console.error('Error saving realtor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px' }}>
      <div>
        <label>First Name:</label>
        <input 
          type="text" 
          value={formData.firstName} 
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input 
          type="text" 
          value={formData.lastName} 
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>License Number:</label>
        <input 
          type="text" 
          value={formData.licenseNumber} 
          onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
          required 
        />
      </div>
      <div>
        <label>Agency:</label>
        <input 
          type="text" 
          value={formData.agency} 
          onChange={(e) => setFormData({...formData, agency: e.target.value})}
          required 
        />
      </div>
      <button type="submit">{realtor ? 'Update' : 'Create'} Realtor</button>
    </form>
  );
};