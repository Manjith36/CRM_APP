import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractionChart from './InteractionChart';
import CustomerTypeChart from './CustomerTypeChart';
import { apiGet } from '../utils/api';
import './Analytics.css';

const Analytics = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [activeInteractionTab, setActiveInteractionTab] = useState('Purchase');
  const [activeCustomerTab, setActiveCustomerTab] = useState('Regular');
  const [interactionCustomers, setInteractionCustomers] = useState([]);
  const [customerTypeCustomers, setCustomerTypeCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomersByType = async (type, isInteraction = false) => {
    setLoading(true);
    try {
      const allCustomers = await apiGet('/api/customers/getAllCustomersSimple');
      let filtered = [];
      
      if (isInteraction) {
        // Filter customers who have interactions of this type
        for (const customer of allCustomers) {
          const interactions = await apiGet(`/api/customers/${customer.id}/interactions`);
          if (interactions.some(interaction => interaction.interactionType === type.toUpperCase())) {
            filtered.push(customer);
          }
        }
        setInteractionCustomers(filtered);
      } else {
        // Filter customers by customer type
        filtered = allCustomers.filter(customer => customer.customerType === type.toUpperCase());
        setCustomerTypeCustomers(filtered);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteractionTabClick = (tab) => {
    setActiveInteractionTab(tab);
    fetchCustomersByType(tab, true);
  };

  const handleCustomerTabClick = (tab) => {
    setActiveCustomerTab(tab);
    fetchCustomersByType(tab, false);
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  // Load initial data
  React.useEffect(() => {
    fetchCustomersByType('Purchase', true);
    fetchCustomersByType('Regular', false);
  }, [refreshTrigger]);

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      
      <div className="chart-section">
        <InteractionChart refreshTrigger={refreshTrigger} />
        <div className="youtube-tabs">
          <div className="tab-list">
            {['Purchase', 'Inquiry', 'Return'].map(tab => (
              <button 
                key={tab}
                className={`tab ${activeInteractionTab === tab ? 'active' : ''}`}
                onClick={() => handleInteractionTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {loading ? (
              <div>Loading customers...</div>
            ) : (
              <div className="customers-grid">
                {interactionCustomers.map(customer => (
                  <div key={customer.id} className="customer-card" onClick={() => handleCustomerClick(customer.id)}>
                    <h4>{customer.firstName} {customer.lastName}</h4>
                    <p>{customer.email}</p>
                    <p>{customer.customerType}</p>
                  </div>
                ))}
                {interactionCustomers.length === 0 && <div>No customers found for {activeInteractionTab} interactions.</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-section">
        <CustomerTypeChart refreshTrigger={refreshTrigger} />
        <div className="youtube-tabs">
          <div className="tab-list">
            {['Regular', 'Premium', 'VIP'].map(tab => (
              <button 
                key={tab}
                className={`tab ${activeCustomerTab === tab ? 'active' : ''}`}
                onClick={() => handleCustomerTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {loading ? (
              <div>Loading customers...</div>
            ) : (
              <div className="customers-grid">
                {customerTypeCustomers.map(customer => (
                  <div key={customer.id} className="customer-card" onClick={() => handleCustomerClick(customer.id)}>
                    <h4>{customer.firstName} {customer.lastName}</h4>
                    <p>{customer.email}</p>
                    <p>{customer.phoneNumber || 'N/A'}</p>
                  </div>
                ))}
                {customerTypeCustomers.length === 0 && <div>No customers found for {activeCustomerTab} type.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;