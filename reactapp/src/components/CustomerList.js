import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../utils/api';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiGet('/api/customers');
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewDetails = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  if (loading) {
    return <div data-testid="loading">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return <div data-testid="empty-msg">No customers found.</div>;
  }

  return (
    <div className="customer-list">
      <h2>Customer List</h2>
      <table data-testid="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.firstName} {customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber || 'N/A'}</td>
              <td>{customer.customerType}</td>
              <td>
                <button
                  onClick={() => handleViewDetails(customer.id)}
                  data-testid={`view-details-${customer.id}`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;