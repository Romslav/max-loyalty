import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TierData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

interface TierDistributionChartProps {
  data: TierData[];
  total: number;
  isLoading?: boolean;
}

const TierDistributionChart: React.FC<TierDistributionChartProps> = ({
  data,
  total,
  isLoading = false,
}) => {
  const defaultColors = [
    '#8B4513', // Bronze
    '#C0C0C0', // Silver
    '#FFD700', // Gold
    '#E5E4E2', // Platinum
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3>Tier Distribution</h3>
          <p className="chart-subtitle">Active members by tier</p>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Total Members</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="chart-skeleton" style={{ height: '300px' }}>
          <div className="skeleton-circle"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                borderRadius: '8px',
              }}
              formatter={(value: number, name, props) => [
                `${value} members (${props.payload.percentage}%)`,
                'Count',
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="tier-legend">
        {data.map((tier, index) => (
          <div key={tier.name} className="legend-item">
            <div
              className="legend-color"
              style={{
                backgroundColor:
                  tier.color || defaultColors[index % defaultColors.length],
              }}
            />
            <div className="legend-info">
              <span className="legend-name">{tier.name}</span>
              <span className="legend-count">
                {tier.value} members ({tier.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierDistributionChart;
