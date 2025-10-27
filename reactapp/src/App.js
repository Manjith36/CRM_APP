import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerRegistrationForm from './components/CustomerRegistrationForm';
import CustomerList from './components/CustomerList';
import CustomerDetails from './components/CustomerDetails';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Register from './components/Register';
import { hasPermission, getCurrentUser, logout } from './utils/auth';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCustomerAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <AppContent refreshTrigger={refreshTrigger} handleCustomerAdded={handleCustomerAdded} />
    </Router>
  );
}

function AppContent({ refreshTrigger, handleCustomerAdded }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isLoginPage = window.location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>CRM System</h1>
        {currentUser && !isLoginPage && (
          <ul>
            <li><Link to="/dashboard">Customer List</Link></li>
            {hasPermission('VIEW_CHARTS') && (
              <li><Link to="/analytics">Analytics</Link></li>
            )}
            {hasPermission('CREATE_CUSTOMER') && (
              <li><Link to="/register-customer">Register Customer</Link></li>
            )}
            {hasPermission('MANAGE_USERS') && (
              <li><Link to="/register">Register User</Link></li>
            )}
            <li><span>Welcome, {getCurrentUser().username} ({getCurrentUser().role})</span></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        )}
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<CustomerList refreshTrigger={refreshTrigger} />} />
          <Route path="/analytics" element={<Analytics refreshTrigger={refreshTrigger} />} />
          <Route path="/register-customer" element={<CustomerRegistrationForm onCustomerAdded={handleCustomerAdded} />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;