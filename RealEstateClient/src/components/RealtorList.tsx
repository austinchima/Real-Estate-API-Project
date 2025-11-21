import { useState, useEffect } from 'react';
import type { Realtor } from '../types';
import { realtorService } from '../services';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Realtors</h2>
      {realtors.map(realtor => (
        <div key={realtor.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{realtor.firstName} {realtor.lastName}</h3>
          <p>Agency: {realtor.agency}</p>
          <p>License: {realtor.licenseNumber}</p>
          <p>Experience: {realtor.yearsOfExperience} years</p>
          <p>Status: {realtor.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      ))}
    </div>
  );
};