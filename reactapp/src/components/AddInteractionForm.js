import React, { useState } from 'react';
import { apiPost } from '../utils/api';
import { INTERACTION_TYPES, INTERACTION_STATUSES } from '../utils/constants';

const AddInteractionForm = ({ customerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    interactionType: '',
    description: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.interactionType) newErrors.interactionType = 'Interaction type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;

    try {
      await apiPost('/api/interactions', {
        ...formData,
        customerId
      });
      setSuccessMessage('Interaction added successfully!');
      setFormData({
        interactionType: '',
        description: '',
        status: ''
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  return (
    <div className="add-interaction-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Interaction Type:</label>
          <select
            name="interactionType"
            value={formData.interactionType}
            onChange={handleChange}
            data-testid="interactionType-select"
          >
            <option value="">Select Type</option>
            {INTERACTION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.interactionType && <div data-testid="interactionType-error" className="error">{errors.interactionType}</div>}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            data-testid="description-input"
            rows="3"
          />
          {errors.description && <div data-testid="description-error" className="error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            data-testid="status-select"
          >
            <option value="">Select Status</option>
            {INTERACTION_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <div data-testid="status-error" className="error">{errors.status}</div>}
        </div>

        <button type="submit" data-testid="add-btn">Add Interaction</button>

        {successMessage && <div data-testid="success-msg" className="success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default AddInteractionForm;