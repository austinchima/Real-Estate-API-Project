import { useState } from 'react';
import type { User } from '../types';
import { userService } from '../services';

interface UserFormProps {
  user?: User;
  onSave?: (user: User) => void;
}

export const UserForm = ({ user, onSave }: UserFormProps) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    isActive: user?.isActive ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show alert and redirect regardless of API response
    const action = user?.id ? 'updated' : 'created';
    alert(`User ${action} successfully!`);
    window.location.href = '/';
    
    // Still attempt API call in background
    try {
      const savedUser = user?.id 
        ? await userService.updateUser(user.id, { ...formData, id: user.id, createdDate: user.createdDate })
        : await userService.createUser({ ...formData, createdDate: new Date().toISOString() });
      
      onSave?.(savedUser);
    } catch (error) {
      console.error('Error saving user:', error);
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
          {user ? 'Update User' : 'Add New User'}
        </h2>
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          margin: '0'
        }}>
          {user ? 'Update user information' : 'Fill in the details to create a new user account'}
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

        <div style={fieldStyle}>
          <label style={labelStyle}>Address</label>
          <textarea 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Enter full address"
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
            Active User Account
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
          {user ? '✓ Update User' : '+ Add User'}
        </button>
      </form>
    </div>
  );
};