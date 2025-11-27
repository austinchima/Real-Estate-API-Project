import { useState, useMemo } from 'react';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { realtorService } from '../services';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { UserCircle, Mail, Phone, Building, Award, Briefcase, Trash2, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// S3 image URLs

export const RealtorList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data: realtors, loading, error, execute } = useAsync(() => realtorService.getAllRealtors());

  const filteredRealtors = useMemo(() => {
    if (!realtors) return [];
    
    return realtors.filter(realtor => {
      const matchesSearch = 
        realtor.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        realtor.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        realtor.agency.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        realtor.specialization.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && realtor.isActive) ||
        (statusFilter === 'inactive' && !realtor.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [realtors, debouncedSearch, statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      await realtorService.deleteRealtor(id);
      execute();
    } catch (error) {
      console.error('Error deleting realtor:', error);
    }
  };

<<<<<<< HEAD
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Realtors</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Realtors</h1>
          <p className="text-muted-foreground">Manage licensed real estate agents</p>
        </div>
        <Button onClick={() => navigate('/realtors/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Realtor
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, agency, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              size="sm"
              className="capitalize"
            >
              {status}
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
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRealtors.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No realtors found</CardTitle>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRealtors.map((realtor) => (
            <Card key={realtor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {realtor.firstName} {realtor.lastName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{realtor.specialization}</p>
                    </div>
                  </div>
                  <Badge variant={realtor.isActive ? 'success' : 'destructive'}>
                    {realtor.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{realtor.agency}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>License: {realtor.licenseNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{realtor.yearsOfExperience} years experience</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{realtor.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{realtor.phoneNumber}</span>
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1">View Details</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Realtor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {realtor.firstName} {realtor.lastName}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(realtor.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
  const getRealtorImage = (id: number) => {
    const imageNumber = ((id - 1) % 5) + 1;
    return `https://realestate-client-bucket.s3.us-east-1.amazonaws.com/Realtor+${imageNumber}.png`;
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
        👨💼 Professional Realtors
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
>>>>>>> tolu
    </div>
  );
};
