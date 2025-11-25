import { useState, useEffect } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';

interface PropertyDetailProps {
  propertyId: number;
}

export const PropertyDetail = ({ propertyId }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getProperty(propertyId);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const getPropertyImage = (id: number) => {
    try {
      const imageNumber = ((id - 1) % 5) + 1;
      return new URL(`../images/Property ${imageNumber}.png`, import.meta.url).href;
    } catch {
      return new URL('../images/Property 1.png', import.meta.url).href;
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
      Loading property details...
    </div>
  );
  
  if (!property) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#e74c3c' }}>
      Property not found
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
        {/* Property Image */}
        <img 
          src={getPropertyImage(property.id)} 
          alt={`Property at ${property.address}`}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover'
          }}
        />
        
        {/* Property Details */}
        <div style={{ padding: '30px' }}>
          <h2 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '2rem',
            color: '#2c3e50'
          }}>
            {property.address}
          </h2>
          
          <p style={{ 
            margin: '0 0 20px 0', 
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>
            📍 {property.city}, {property.state} {property.zipCode}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                ${property.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Price</div>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                🛏️ {property.bedrooms}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Bedrooms</div>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9b59b6' }}>
                🛿 {property.bathrooms}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Bathrooms</div>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e67e22' }}>
                📐 {property.squareFeet}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Square Feet</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <span style={{
              background: '#3498db',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              {property.propertyType}
            </span>
            <span style={{
              background: property.status === 'Available' ? '#27ae60' : '#e74c3c',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              {property.status}
            </span>
          </div>
          
          <div style={{
            background: '#ecf0f1',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Description</h3>
            <p style={{ 
              margin: '0', 
              color: '#666',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};