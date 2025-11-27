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

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {realtor ? 'Update Realtor' : 'Add New Realtor'}
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          margin: '0'
        }}>
          {realtor ? 'Update realtor information' : 'Fill in the details to add a new realtor'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>First Name</label>
            <input 
              type="text" 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Enter first name"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Last Name</label>
            <input 
              type="text" 
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Enter last name"
              required 
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Email Address</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Enter email address"
            required 
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input 
            type="tel" 
            value={formData.phoneNumber} 
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Enter phone number"
            required 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>License Number</label>
            <input 
              type="text" 
              value={formData.licenseNumber} 
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Enter license number"
              required 
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Years of Experience</label>
            <input 
              type="number" 
              value={formData.yearsOfExperience} 
              onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              placeholder="Years"
              min="0"
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Agency</label>
          <input 
            type="text" 
            value={formData.agency} 
            onChange={(e) => setFormData({...formData, agency: e.target.value})}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Enter agency name"
            required 
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Specialization</label>
          <input 
            type="text" 
            value={formData.specialization} 
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="e.g., Residential, Commercial, Luxury Homes"
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <input 
            type="checkbox" 
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            style={{
              marginRight: '12px',
              width: '18px',
              height: '18px',
              accentColor: '#3b82f6'
            }}
          />
          <label htmlFor="isActive" style={{
            fontSize: '16px',
            color: '#374151',
            cursor: 'pointer'
          }}>
            Active Realtor
          </label>
        </div>

        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          {realtor ? '✓ Update Realtor' : '+ Add Realtor'}
        </button>
      </form>
    </div>
  );
};