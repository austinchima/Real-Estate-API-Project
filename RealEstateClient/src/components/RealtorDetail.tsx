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

  const getRealtorImage = (id: number) => {
    const imageNumber = ((id - 1) % 5) + 1;
    return `https://realestate-client-bucket.s3.us-east-1.amazonaws.com/Realtor+${imageNumber}.png`;
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
      Loading realtor details...
    </div>
  );
  
  if (!realtor) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#e74c3c' }}>
      Realtor not found
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {/* Header with gradient background */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <img 
            src={getRealtorImage(realtor.id)} 
            alt={`${realtor.firstName} ${realtor.lastName}`}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '5px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              marginBottom: '20px'
            }}
          />
          
          <h2 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '2.2rem',
            fontWeight: 'bold'
          }}>
            {realtor.firstName} {realtor.lastName}
          </h2>
          
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '1rem',
            display: 'inline-block'
          }}>
            {realtor.agency}
          </div>
        </div>
        
        {/* Contact Information */}
        <div style={{ padding: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '1.5rem' }}>
            Contact Information
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📧</div>
              <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>Email</div>
              <div style={{ color: '#666' }}>{realtor.email}</div>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
              <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>Phone</div>
              <div style={{ color: '#666' }}>{realtor.phoneNumber}</div>
            </div>
          </div>
          
          {/* Professional Details */}
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '1.5rem' }}>
            Professional Details
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: '#e8f5e8',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60', marginBottom: '5px' }}>
                {realtor.yearsOfExperience}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Years of Experience</div>
            </div>
            
            <div style={{
              background: '#e8f4fd',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3498db', marginBottom: '5px' }}>
                🆔 {realtor.licenseNumber}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>License Number</div>
            </div>
            
            <div style={{
              background: realtor.isActive ? '#e8f5e8' : '#fdeaea',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '5px',
                color: realtor.isActive ? '#27ae60' : '#e74c3c'
              }}>
                {realtor.isActive ? '✅' : '❌'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {realtor.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
          
          {/* Specialization */}
          <div style={{
            background: '#f8f9fa',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '1.2rem' }}>
              🎯 Specialization
            </h4>
            <p style={{ 
              margin: '0', 
              color: '#666',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              {realtor.specialization}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};