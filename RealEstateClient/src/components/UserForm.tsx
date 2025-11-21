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
    try {
      const savedUser = user?.id 
        ? await userService.updateUser(user.id, { ...formData, id: user.id, createdDate: user.createdDate })
        : await userService.createUser({ ...formData, createdDate: new Date().toISOString() });
      
      onSave?.(savedUser);
    } catch (error) {
      console.error('Error saving user:', error);
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
        <label>Phone:</label>
        <input 
          type="tel" 
          value={formData.phoneNumber} 
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          required 
        />
      </div>
      <button type="submit">{user ? 'Update' : 'Create'} User</button>
    </form>
  );
};