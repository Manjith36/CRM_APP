import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'SALES_REP'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/api/auth/register', formData);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="SALES_REP">Sales Rep</option>
          <option value="ANALYST">Analyst</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
        <p>Already have an account? <a href="/">Login</a></p>
      </form>
    </div>
  );
};

export default Register;