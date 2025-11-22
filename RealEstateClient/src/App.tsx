import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PropertyList, UserList, RealtorList, PropertyForm, UserForm, RealtorForm } from './components';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '20px' }}>Properties</Link>
          <Link to="/users" style={{ marginRight: '20px' }}>Users</Link>
          <Link to="/realtors" style={{ marginRight: '20px' }}>Realtors</Link>
          <Link to="/properties/new" style={{ marginRight: '20px' }}>Add Property</Link>
          <Link to="/users/new" style={{ marginRight: '20px' }}>Add User</Link>
          <Link to="/realtors/new">Add Realtor</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/realtors" element={<RealtorList />} />
          <Route path="/properties/new" element={<PropertyForm />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/realtors/new" element={<RealtorForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;