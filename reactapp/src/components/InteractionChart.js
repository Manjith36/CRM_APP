import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiGet } from '../utils/api';
import './InteractionChart.css';

const InteractionChart = ({ refreshTrigger }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        const allTypes = ['PURCHASE', 'INQUIRY', 'RETURN'];
        const data = allTypes.map(type => {
          const typeStats = stats[type] || { total: 0, open: 0, resolved: 0 };
          return { 
            name: type, 
            total: typeStats.total, 
            open: typeStats.open, 
            resolved: typeStats.resolved 
          };
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-tooltip">
          <p><strong>{label}</strong></p>
          <p>Total: {payload[0].payload.total}</p>
          <p>Open: {payload[0].payload.open}</p>
          <p>Resolved: {payload[0].payload.resolved}</p>
        </div>
      );
    }
    return null;
  };

  const colors = ['#00ff00', '#8000ff', '#eb5600']; // Purchase=green, Inquiry=purple, Return=orange

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="interaction-chart">
      <h2>Interaction Types Distribution</h2>
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

export default InteractionChart;