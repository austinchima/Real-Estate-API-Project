import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyList, UserList, RealtorList, PropertyForm, UserForm, RealtorForm } from './components';
import { Navbar } from './components/ui/navbar';
import { Home, Building2, Users, UserCircle } from 'lucide-react';

function App() {
  const menuItems = [
    { 
      title: "Properties", 
      url: "/", 
      icon: <Building2 className="size-5 shrink-0" />,
      items: [
        {
          title: "All Properties",
          description: "View all property listings",
          icon: <Building2 className="size-5 shrink-0" />,
          url: "/"
        },
        {
          title: "Add Property",
          description: "Create a new property listing",
          icon: <Building2 className="size-5 shrink-0" />,
          url: "/properties/new"
        }
      ]
    },
    { 
      title: "Users", 
      url: "/users", 
      icon: <Users className="size-5 shrink-0" />,
      items: [
        {
          title: "All Users",
          description: "View all registered users",
          icon: <Users className="size-5 shrink-0" />,
          url: "/users"
        },
        {
          title: "Add User",
          description: "Register a new user",
          icon: <Users className="size-5 shrink-0" />,
          url: "/users/new"
        }
      ]
    },
    { 
      title: "Realtors", 
      url: "/realtors", 
      icon: <UserCircle className="size-5 shrink-0" />,
      items: [
        {
          title: "All Realtors",
          description: "View all licensed realtors",
          icon: <UserCircle className="size-5 shrink-0" />,
          url: "/realtors"
        },
        {
          title: "Add Realtor",
          description: "Register a new realtor",
          icon: <UserCircle className="size-5 shrink-0" />,
          url: "/realtors/new"
        }
      ]
    },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar 
          logo={{
            url: "/",
            src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
            alt: "Real Estate Logo",
            title: "Real Estate App"
          }}
          menu={menuItems}
        />
        
        <main className="container mx-auto px-4 py-8 animate-slide-in">
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/realtors" element={<RealtorList />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/realtors/new" element={<RealtorForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;