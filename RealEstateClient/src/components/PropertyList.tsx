import { useState, useEffect } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';

// S3 image URLs

export const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const getPropertyImage = (id: number) => {
    const imageNumber = ((id - 1) % 5) + 1;
    return `https://realestate-client-bucket.s3.us-east-1.amazonaws.com/Property+${imageNumber}.png`;
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
      Loading properties...
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
        🏠 Available Properties
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {properties.map(property => (
          <div key={property.id} style={{
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
            
            <img 
              src={getPropertyImage(property.id)} 
              alt={`Property at ${property.address}`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '1.3rem',
                color: '#2c3e50'
              }}>
                {property.address}
              </h3>
              
              <p style={{ 
                margin: '0 0 15px 0', 
                color: '#7f8c8d',
                fontSize: '0.95rem'
              }}>
                📍 {property.city}, {property.state} {property.zipCode}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: '#27ae60'
                }}>
                  ${property.price.toLocaleString()}
                </span>
                
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#555' }}>
                  <span>🛏️ {property.bedrooms}</span>
                  <span>🛿 {property.bathrooms}</span>
                  <span>📐 {property.squareFeet} sq ft</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{
                  background: '#3498db',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {property.propertyType}
                </span>
                <span style={{
                  background: property.status === 'Available' ? '#27ae60' : '#e74c3c',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {property.status}
                </span>
              </div>
              
              <p style={{
                margin: '0 0 15px 0',
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {property.description}
              </p>
              
              <button 
                onClick={() => handleDelete(property.id)} 
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