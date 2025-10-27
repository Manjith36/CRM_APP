import React, { useState } from 'react';
import { apiPost } from '../utils/api';
import { CUSTOMER_TYPES } from '../utils/constants';
import './CustomerRegistrationForm.css';

const CustomerRegistrationForm = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    customerType: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.customerType) newErrors.customerType = 'Customer type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;

    try {
      await apiPost('/api/customers/addCustomer', formData);
      setSuccessMessage('Customer registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        customerType: ''
      });
      if (onCustomerAdded) onCustomerAdded();
    } catch (error) {
      setApiError(error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      customerType: ''
    });
    setErrors({});
    setSuccessMessage('');
    setApiError('');
  };

  return (
    <div className="customer-registration-form">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            data-testid="firstName-input"
          />
          {errors.firstName && <div data-testid="firstName-error" className="error">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            data-testid="lastName-input"
          />
          {errors.lastName && <div data-testid="lastName-error" className="error">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            data-testid="email-input"
          />
          {errors.email && <div data-testid="email-error" className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            data-testid="phoneNumber-input"
          />
        </div>

        <div className="form-group">
          <label>Customer Type:</label>
          <select
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            data-testid="customerType-select"
          >
            <option value="">Select Customer Type</option>
            {CUSTOMER_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.customerType && <div data-testid="customerType-error" className="error">{errors.customerType}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" data-testid="submit-btn">Register Customer</button>
          <button type="button" onClick={handleReset} data-testid="reset-btn">Reset</button>
        </div>

        {successMessage && <div data-testid="success-msg" className="success">{successMessage}</div>}
        {apiError && <div data-testid="api-error" className="error">{apiError}</div>}
      </form>
    </div>
  );
};

export default CustomerRegistrationForm;