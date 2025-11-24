import { useState, useEffect } from 'react';
import  type{ User } from '../types';
import { userService } from '../services';

interface UserDetailProps {
  userId: number;
}

export const UserDetail = ({ userId }: UserDetailProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUser(userId);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>{user.firstName} {user.lastName}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phoneNumber}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
      <p><strong>Created:</strong> {new Date(user.createdDate).toLocaleDateString()}</p>
    </div>
  );
};