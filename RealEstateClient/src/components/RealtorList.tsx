import { useState, useEffect } from 'react';
import type  { Realtor } from '../types';
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

  const handleDelete = async (id: number) => {
    try {
      await realtorService.deleteRealtor(id);
      setRealtors(realtors.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting realtor:', error);
    }
  };

  const getRealtorImage = (id: number) => {
    try {
      // Use import.meta.url for Vite compatibility
      const imageNumber = ((id - 1) % 5) + 1;
      return new URL(`../images/Realtor ${imageNumber}.png`, import.meta.url).href;
    } catch {
      return new URL('../images/Realtor 1.png', import.meta.url).href;
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
      Loading realtors...
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        marginBottom: '30px',
        color: '#333'
      }}>
        👨‍💼 Professional Realtors
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px'
      }}>
        {realtors.map(realtor => (
          <div key={realtor.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            background: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '20px 20px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <img 
                src={getRealtorImage(realtor.id)} 
                alt={`${realtor.firstName} ${realtor.lastName}`}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '1.4rem',
                color: '#2c3e50'
              }}>
                {realtor.firstName} {realtor.lastName}
              </h3>
              
              <div style={{
                background: '#3498db',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '0.85rem',
                display: 'inline-block',
                marginBottom: '15px'
              }}>
                {realtor.agency}
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <p style={{ 
                  margin: '5px 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  📧 {realtor.email}
                </p>
                <p style={{ 
                  margin: '5px 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  📞 {realtor.phoneNumber}
                </p>
                <p style={{ 
                  margin: '5px 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  🆔 License: {realtor.licenseNumber}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '15px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {realtor.yearsOfExperience}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Years Exp.
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: realtor.isActive ? '#27ae60' : '#e74c3c'
                  }}>
                    {realtor.isActive ? '✅' : '❌'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Status
                  </div>
                </div>
              </div>
              
              <div style={{
                background: '#ecf0f1',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <strong style={{ color: '#2c3e50', fontSize: '0.9rem' }}>
                  Specialization:
                </strong>
                <p style={{ 
                  margin: '5px 0 0 0', 
                  color: '#666',
                  fontSize: '0.85rem'
                }}>
                  {realtor.specialization}
                </p>
              </div>
              
              <button 
                onClick={() => handleDelete(realtor.id)} 
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};