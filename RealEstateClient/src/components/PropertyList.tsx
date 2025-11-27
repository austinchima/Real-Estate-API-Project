import { useState, useMemo } from 'react';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { propertyService } from '../services';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Building2, Bed, Bath, Maximize, MapPin, DollarSign, Trash2, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// S3 image URLs

export const PropertyList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data: properties, loading, error, execute } = useAsync(() => propertyService.getAllProperties());

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter(property => {
      const matchesSearch = 
        property.address.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        property.state.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [properties, debouncedSearch, statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      await propertyService.deleteProperty(id);
      execute();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

<<<<<<< HEAD
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Properties</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your real estate listings</p>
        </div>
        <Button onClick={() => navigate('/properties/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by address, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Available', 'Sold', 'Pending'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No properties found</CardTitle>
          <CardDescription>Try adjusting your search or filters</CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl line-clamp-1">{property.address}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {property.city}, {property.state} {property.zipCode}
                    </CardDescription>
                  </div>
                  <Badge variant={property.status === 'Available' ? 'success' : property.status === 'Sold' ? 'destructive' : 'warning'}>
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <DollarSign className="h-6 w-6" />
                  {property.price.toLocaleString()}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Badge variant="outline">{property.propertyType}</Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {property.description}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="gap-2 pt-4">
                <Button variant="outline" className="flex-1">View Details</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{property.address}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(property.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
=======
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
>>>>>>> tolu
    </div>
  );
};
