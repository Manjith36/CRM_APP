import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerRegistrationForm from './components/CustomerRegistrationForm';
import CustomerList from './components/CustomerList';
import CustomerDetails from './components/CustomerDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>CRM System</h1>
          <ul>
            <li><Link to="/">Customer List</Link></li>
            <li><Link to="/register">Register Customer</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/register" element={<CustomerRegistrationForm />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;