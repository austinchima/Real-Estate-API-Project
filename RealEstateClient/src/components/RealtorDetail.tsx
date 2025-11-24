import { useState, useEffect } from 'react';
import type { Realtor } from '../types';
import { realtorService } from '../services';

interface RealtorDetailProps {
  realtorId: number;
}

export const RealtorDetail = ({ realtorId }: RealtorDetailProps) => {
  const [realtor, setRealtor] = useState<Realtor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealtor = async () => {
      try {
        const data = await realtorService.getRealtor(realtorId);
        setRealtor(data);
      } catch (error) {
        console.error('Error fetching realtor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtor();
  }, [realtorId]);

  if (loading) return <div>Loading...</div>;
  if (!realtor) return <div>Realtor not found</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>{realtor.firstName} {realtor.lastName}</h2>
      <p><strong>Email:</strong> {realtor.email}</p>
      <p><strong>Phone:</strong> {realtor.phoneNumber}</p>
      <p><strong>License:</strong> {realtor.licenseNumber}</p>
      <p><strong>Agency:</strong> {realtor.agency}</p>
      <p><strong>Experience:</strong> {realtor.yearsOfExperience} years</p>
      <p><strong>Specialization:</strong> {realtor.specialization}</p>
      <p><strong>Status:</strong> {realtor.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
};