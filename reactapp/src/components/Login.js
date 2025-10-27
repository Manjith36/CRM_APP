import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost('/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on user role
      if (response.user.role === 'ADMIN') {
        navigate('/dashboard');
      } else if (response.user.role === 'SALES_REP') {
        navigate('/dashboard');
      } else if (response.user.role === 'ANALYST') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
        <p>Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
};

export default Login;