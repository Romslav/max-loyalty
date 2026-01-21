import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PointsData {
  label: string;
  value: number;
  timestamp: string;
}

interface PointsIssuedChartProps {
  data: PointsData[];
  total: number;
  average: number;
  isLoading?: boolean;
}

const PointsIssuedChart: React.FC<PointsIssuedChartProps> = ({
  data,
  total,
  average,
  isLoading = false,
}) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3>Points Issued</h3>
          <p className="chart-subtitle">Last 30 days</p>
        </div>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{total.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Daily Average</span>
            <span className="stat-value">{Math.round(average)}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="chart-skeleton">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="skeleton-bar" style={{ width: '14%' }}></div>
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              stroke="var(--color-text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value.toLocaleString()} points`}
            />
            <Bar
              dataKey="value"
              fill="#8B5CF6"
              isAnimationActive={true}
              animationDuration={800}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PointsIssuedChart;
