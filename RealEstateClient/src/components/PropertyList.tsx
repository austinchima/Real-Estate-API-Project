import { useState, useEffect } from 'react';
import type { Property } from '../types';
import { propertyService } from '../services';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Properties</h2>
      {properties.map(property => (
        <div key={property.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{property.address}</h3>
          <p>{property.city}, {property.state} {property.zipCode}</p>
          <p>Price: ${property.price.toLocaleString()}</p>
          <p>{property.bedrooms} bed, {property.bathrooms} bath</p>
          <button onClick={() => handleDelete(property.id)} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};