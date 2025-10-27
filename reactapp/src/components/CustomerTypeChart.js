import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiGet } from '../utils/api';
import './CustomerTypeChart.css';

const CustomerTypeChart = ({ refreshTrigger }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerTypeStats = async () => {
      try {
        const customers = await apiGet('/api/customers/getAllCustomersSimple');
        const stats = {};
        
        for (const customer of customers) {
          const interactions = await apiGet(`/api/customers/${customer.id}/interactions`);
          if (!stats[customer.customerType]) {
            stats[customer.customerType] = { total: 0, withInteractions: 0, withoutInteractions: 0 };
          }
          stats[customer.customerType].total++;
          if (interactions.length > 0) {
            stats[customer.customerType].withInteractions++;
          } else {
            stats[customer.customerType].withoutInteractions++;
          }
        }
        
        const allTypes = ['REGULAR', 'PREMIUM', 'VIP'];
        const data = allTypes.map(type => {
          const typeStats = stats[type] || { total: 0, withInteractions: 0, withoutInteractions: 0 };
          return { 
            name: type, 
            total: typeStats.total, 
            withInteractions: typeStats.withInteractions, 
            withoutInteractions: typeStats.withoutInteractions 
          };
        });
        setChartData(data);
      } catch (error) {
        console.error('Error fetching customer type stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypeStats();
  }, [refreshTrigger]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-tooltip">
          <p><strong>{label}</strong></p>
          <p>Total: {payload[0].payload.total}</p>
          <p>With Interactions: {payload[0].payload.withInteractions}</p>
          <p>Without Interactions: {payload[0].payload.withoutInteractions}</p>
        </div>
      );
    }
    return null;
  };

  const colors = ['#0836c0', '#10ddd2', '#f6cd00']; // Regular=blue, Premium=teal, VIP=gold

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="customer-type-chart">
      <h2>Customer Types Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerTypeChart;