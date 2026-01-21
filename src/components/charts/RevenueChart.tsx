import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

interface RevenueData {
  label: string;
  value: number;
  timestamp: string;
}

interface RevenueChartProps {
  data: RevenueData[];
  total: number;
  average: number;
  trend: number;
  isLoading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  total,
  average,
  trend,
  isLoading = false,
}) => {
  const trendColor = trend >= 0 ? '#10B981' : '#EF4444';
  const trendIcon = trend >= 0 ? '📈' : '📉';

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3>Revenue</h3>
          <p className="chart-subtitle">Last 30 days</p>
        </div>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{formatCurrency(total)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average</span>
            <span className="stat-value">{formatCurrency(average)}</span>
          </div>
          <div className="stat" style={{ borderColor: trendColor }}>
            <span className="stat-label">Trend</span>
            <span className="stat-value" style={{ color: trendColor }}>
              {trendIcon} {trend >= 0 ? '+' : ''}{trend}%
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
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
