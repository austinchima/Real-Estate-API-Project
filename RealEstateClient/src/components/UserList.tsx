import { useState, useEffect } from 'react';
import  type { User } from '../types';
import { userService } from '../services';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNumber}</p>
          <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
          <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};