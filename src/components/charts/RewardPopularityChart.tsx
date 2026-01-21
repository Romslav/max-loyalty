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

interface RewardData {
  name: string;
  redemptions: number;
  percentage: number;
}

interface RewardPopularityChartProps {
  data: RewardData[];
  total: number;
  isLoading?: boolean;
}

const RewardPopularityChart: React.FC<RewardPopularityChartProps> = ({
  data,
  total,
  isLoading = false,
}) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3>Top Rewards</h3>
          <p className="chart-subtitle">Most redeemed rewards</p>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Total Redemptions</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="chart-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-bar"></div>
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-text-secondary)" />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--color-text-secondary)"
              width={180}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                borderRadius: '8px',
              }}
              formatter={(value: number, name) =>
                name === 'redemptions'
                  ? `${value} redemptions`
                  : `${value}%`
              }
            />
            <Bar
              dataKey="redemptions"
              fill="#F59E0B"
              isAnimationActive={true}
              animationDuration={800}
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="reward-stats">
        {data.slice(0, 3).map((reward, index) => (
          <div key={reward.name} className="reward-stat">
            <div className="reward-rank">#{index + 1}</div>
            <div className="reward-info">
              <p className="reward-name">{reward.name}</p>
              <p className="reward-detail">
                {reward.redemptions} redemptions ({reward.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardPopularityChart;
