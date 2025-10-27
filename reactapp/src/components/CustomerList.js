import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiDelete } from '../utils/api';
import { hasPermission } from '../utils/auth';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiGet(`/api/customers/getAllCustomers?page=${currentPage}&size=${pageSize}`);
        setCustomers(data.customers || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage]);

  const handleViewDetails = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer and all their interactions?')) {
      try {
        await apiDelete(`/api/customers/deleteCustomer/${customerId}`);
        setCustomers(customers.filter(customer => customer.id !== customerId));
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const refreshCharts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };



  if (loading) {
    return <div data-testid="loading">Loading customers...</div>;
  }

  if (!customers || customers.length === 0) {
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
                {hasPermission('DELETE_CUSTOMER') && (
                  <button
                    onClick={() => handleDelete(customer.id)}
                    data-testid={`delete-${customer.id}`}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1} of {totalPages} ({totalElements} total customers)</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerList;