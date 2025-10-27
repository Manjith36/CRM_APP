import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import './CustomerTypeChart.css';

const CustomerTypeChart = ({ refreshTrigger }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

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
        
        // Always show all customer types
        const allTypes = ['REGULAR', 'PREMIUM', 'VIP'];
        const data = allTypes.map(type => {
          const typeStats = stats[type] || { total: 0, withInteractions: 0, withoutInteractions: 0 };
          return { type, count: typeStats.total, withInteractions: typeStats.withInteractions, withoutInteractions: typeStats.withoutInteractions };
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

  if (loading) return <div>Loading chart...</div>;
  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  const getBarColorClass = (type) => {
    switch(type.toUpperCase()) {
      case 'REGULAR': return 'bar-color-regular';
      case 'PREMIUM': return 'bar-color-premium';
      case 'VIP': return 'bar-color-vip';
      default: return `bar-color-${chartData.findIndex(item => item.type === type) % 6}`;
    }
  };

  return (
    <div className="customer-type-chart">
      <h2>Customer Types Distribution</h2>
      <div className="chart-container">
        {chartData.map(({ type, count, withInteractions, withoutInteractions }, index) => (
          <div key={type} className="chart-bar">
            <div className="bar-label">{type}</div>
            <div className="bar-wrapper">
              <div 
                className={`bar ${getBarColorClass(type)}`}
                style={{ width: `${(count / maxCount) * 300}px` }}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltip({
                    visible: true,
                    x: rect.right + 10,
                    y: rect.top,
                    data: { type, total: count, withInteractions, withoutInteractions }
                  });
                }}
                onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, data: null })}
              />
              <div className="bar-value">{count}</div>
            </div>
          </div>
        ))}
        {tooltip.visible && (
          <div 
            className="tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div><strong>{tooltip.data.type}</strong></div>
            <div>Total: {tooltip.data.total}</div>
            <div>With Interactions: {tooltip.data.withInteractions}</div>
            <div>Without Interactions: {tooltip.data.withoutInteractions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTypeChart;