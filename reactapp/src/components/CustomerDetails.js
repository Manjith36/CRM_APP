import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../utils/api';
import AddInteractionForm from './AddInteractionForm';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomerData = async () => {
    try {
      const customerData = await apiGet(`/api/customers/${id}`);
      const interactionsData = await apiGet(`/api/customers/${id}/interactions`);
      setCustomer(customerData);
      setInteractions(interactionsData);
    } catch (error) {
      setError('Customer not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const handleInteractionAdded = () => {
    fetchCustomerData();
  };

  if (loading) {
    return <div>Loading customer details...</div>;
  }

  if (error) {
    return <div data-testid="customer-detail-error">{error}</div>;
  }

  return (
    <div className="customer-details">
      <h2>Customer Details</h2>
      {customer && (
        <div className="customer-info">
          <h3>{customer.firstName} {customer.lastName}</h3>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber || 'N/A'}</p>
          <p><strong>Type:</strong> {customer.customerType}</p>
          <p><strong>Registration Date:</strong> {customer.registrationDate}</p>
        </div>
      )}

      <div className="interactions-section">
        <h3>Interactions</h3>
        {interactions.length === 0 ? (
          <p>No interactions found.</p>
        ) : (
          <div className="interactions-list">
            {interactions.map(interaction => (
              <div key={interaction.id} data-testid={`interaction-row-${interaction.id}`} className="interaction-item">
                <p><strong>Type:</strong> {interaction.interactionType}</p>
                <p><strong>Date:</strong> {new Date(interaction.interactionDate).toLocaleString()}</p>
                <p><strong>Description:</strong> {interaction.description}</p>
                <p><strong>Status:</strong> {interaction.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="add-interaction-section">
        <h3>Add New Interaction</h3>
        <AddInteractionForm customerId={parseInt(id)} onSuccess={handleInteractionAdded} />
      </div>
    </div>
  );
};

export default CustomerDetails;