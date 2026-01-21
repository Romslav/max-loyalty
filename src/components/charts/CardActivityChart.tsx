import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ActivityData {
  label: string;
  value: number;
  timestamp: string;
}

interface CardActivityChartProps {
  data: ActivityData[];
  totalActive: number;
  totalInactive: number;
  growthRate: number;
  isLoading?: boolean;
}

const CardActivityChart: React.FC<CardActivityChartProps> = ({
  data,
  totalActive,
  totalInactive,
  growthRate,
  isLoading = false,
}) => {
  const total = totalActive + totalInactive;
  const activePercentage = total > 0 ? Math.round((totalActive / total) * 100) : 0;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3>Card Activity</h3>
          <p className="chart-subtitle">Last 30 days</p>
        </div>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">Active</span>
            <span className="stat-value" style={{ color: '#10B981' }}>
              {totalActive}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Inactive</span>
            <span className="stat-value" style={{ color: '#6B7280' }}>
              {totalInactive}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Growth</span>
            <span className="stat-value" style={{ color: '#3B82F6' }}>
              {growthRate}%
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="chart-skeleton">
          <div className="skeleton-line"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => `${value} active cards`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="activity-breakdown">
        <div className="breakdown-item active">
          <div className="breakdown-bar">
            <div
              className="breakdown-fill"
              style={{
                width: `${activePercentage}%`,
                backgroundColor: '#10B981',
              }}
            />
          </div>
          <p className="breakdown-label">
            Active Cards: {activePercentage}%
          </p>
        </div>
        <div className="breakdown-item inactive">
          <div className="breakdown-bar">
            <div
              className="breakdown-fill"
              style={{
                width: `${100 - activePercentage}%`,
                backgroundColor: '#6B7280',
              }}
            />
          </div>
          <p className="breakdown-label">
            Inactive Cards: {100 - activePercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardActivityChart;
