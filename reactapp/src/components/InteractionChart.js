import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import './InteractionChart.css';

const InteractionChart = ({ refreshTrigger }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    const fetchInteractionStats = async () => {
      try {
        const customers = await apiGet('/api/customers/getAllCustomersSimple');
        const stats = {};
        
        for (const customer of customers) {
          const interactions = await apiGet(`/api/customers/${customer.id}/interactions`);
          interactions.forEach(interaction => {
            if (!stats[interaction.interactionType]) {
              stats[interaction.interactionType] = { total: 0, open: 0, resolved: 0 };
            }
            stats[interaction.interactionType].total++;
            if (interaction.status === 'OPEN' || interaction.status === 'IN_PROGRESS') {
              stats[interaction.interactionType].open++;
            } else if (interaction.status === 'RESOLVED' || interaction.status === 'CLOSED') {
              stats[interaction.interactionType].resolved++;
            }
          });
        }
        
        // Always show all interaction types
        const allTypes = ['PURCHASE', 'INQUIRY', 'RETURN'];
        const data = allTypes.map(type => {
          const typeStats = stats[type] || { total: 0, open: 0, resolved: 0 };
          return { type, count: typeStats.total, open: typeStats.open, resolved: typeStats.resolved };
        });
        setChartData(data);
      } catch (error) {
        console.error('Error fetching interaction stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionStats();
  }, [refreshTrigger]);

  if (loading) return <div>Loading chart...</div>;
  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  const getBarColorClass = (type) => {
    switch(type.toUpperCase()) {
      case 'PURCHASE': return 'bar-color-purchase';
      case 'INQUIRY': return 'bar-color-enquiry';
      case 'RETURN': return 'bar-color-return';
      default: return `bar-color-${chartData.findIndex(item => item.type === type) % 6}`;
    }
  };

  return (
    <div className="interaction-chart">
      <h2>Interaction Types Distribution</h2>
      <div className="chart-container">
        {chartData.map(({ type, count, open, resolved }, index) => (
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
                    data: { type, total: count, open, resolved }
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
            <div>Open: {tooltip.data.open}</div>
            <div>Resolved: {tooltip.data.resolved}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionChart;