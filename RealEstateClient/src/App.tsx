import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, PropertyList, UserList, RealtorList, PropertyForm, UserForm, RealtorForm, PropertyDetail, RealtorDetail } from './components';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {/* Modern Navigation Header */}
        <nav style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: '0',
          zIndex: '1000'
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            {/* Logo/Brand */}
            <Link to="/" style={{
              textDecoration: 'none',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              padding: '15px 0'
            }}>
              🏠 Real Estate Pro
            </Link>
            
            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '0' }}>
              <Link to="/" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '15px 20px',
                transition: 'background 0.3s ease',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🏠 Home
              </Link>
              <Link to="/properties" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '15px 20px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🏢 Properties
              </Link>
              <Link to="/realtors" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '15px 20px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                👨💼 Realtors
              </Link>
              <Link to="/users" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '15px 20px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                👥 Users
              </Link>
            </div>
            
            {/* Quick Add Dropdown */}
            <div style={{ position: 'relative' }}>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => {
                const dropdown = document.getElementById('quickAddDropdown');
                if (dropdown) {
                  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
              }}
              >
                ➕ Quick Add
              </button>
              
              <div id="quickAddDropdown" style={{
                display: 'none',
                position: 'absolute',
                right: '0',
                top: '100%',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '180px',
                zIndex: '1001',
                marginTop: '5px'
              }}>
                <Link to="/properties/new" style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#333',
                  textDecoration: 'none',
                  borderBottom: '1px solid #eee',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🏠 Add Property
                </Link>
                <Link to="/realtors/new" style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#333',
                  textDecoration: 'none',
                  borderBottom: '1px solid #eee',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  👨💼 Add Realtor
                </Link>
                <Link to="/users/new" style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  👥 Add User
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content Area */}
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/realtors" element={<RealtorList />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/properties/:id" element={<PropertyDetail propertyId={1} />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/realtors/new" element={<RealtorForm />} />
            <Route path="/realtors/:id" element={<RealtorDetail realtorId={1} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;