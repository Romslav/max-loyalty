import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RevenueChart from '../components/charts/RevenueChart';
import TierDistributionChart from '../components/charts/TierDistributionChart';
import RewardPopularityChart from '../components/charts/RewardPopularityChart';
import CardActivityChart from '../components/charts/CardActivityChart';
import PointsIssuedChart from '../components/charts/PointsIssuedChart';
import { DateRange } from '../types/analytics';

interface ChartData {
  label: string;
  value: number;
  timestamp?: string;
}

interface AnalyticsData {
  revenue: {
    data: ChartData[];
    total: number;
    average: number;
    trend: number;
  };
  tierDistribution: {
    data: Array<{
      name: string;
      value: number;
      percentage: number;
      color?: string;
    }>;
    total: number;
  };
  topCustomers: {
    data: Array<{
      id: string;
      name: string;
      points: number;
      spend: number;
      tier: string;
    }>;
    limit: number;
  };
  rewardPopularity: {
    data: Array<{
      id: string;
      name: string;
      redemptions: number;
      percentage: number;
    }>;
    total: number;
  };
  cardActivity: {
    data: ChartData[];
    totalActive: number;
    totalInactive: number;
    growthRate: number;
  };
  pointsIssued: {
    data: ChartData[];
    total: number;
    average: number;
  };
}

const AdvancedAnalyticsPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(DateRange.THIRTY_DAYS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [restaurantId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/analytics/restaurants/${restaurantId}/overview?range=${dateRange}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!analyticsData) return;

    // Create CSV content
    let csv = 'MaxLoyalty Analytics Report\n';
    csv += `Date: ${new Date().toISOString()}\n\n`;

    // Revenue data
    csv += 'Revenue\n';
    csv += 'Date,Revenue\n';
    analyticsData.revenue.data.forEach((item) => {
      csv += `${item.label},${item.value}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    // PDF export would require additional library
    console.log('PDF export not yet implemented');
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Advanced Analytics</h1>
          <p className="page-subtitle">Comprehensive business intelligence</p>
        </div>

        <div className="header-controls">
          <div className="date-range-selector">
            <button
              className={`range-btn ${dateRange === DateRange.SEVEN_DAYS ? 'active' : ''}`}
              onClick={() => setDateRange(DateRange.SEVEN_DAYS)}
            >
              7 Days
            </button>
            <button
              className={`range-btn ${dateRange === DateRange.THIRTY_DAYS ? 'active' : ''}`}
              onClick={() => setDateRange(DateRange.THIRTY_DAYS)}
            >
              30 Days
            </button>
            <button
              className={`range-btn ${dateRange === DateRange.NINETY_DAYS ? 'active' : ''}`}
              onClick={() => setDateRange(DateRange.NINETY_DAYS)}
            >
              90 Days
            </button>
          </div>

          <div className="export-buttons">
            <button className="btn btn--secondary" onClick={handleExportCSV}>
              📥 CSV
            </button>
            <button className="btn btn--secondary" onClick={handleExportPDF}>
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button className="btn btn--secondary" onClick={fetchAnalytics}>
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      ) : analyticsData ? (
        <div className="analytics-grid">
          {/* Revenue Chart */}
          <div className="chart-grid-item full-width">
            <RevenueChart
              data={analyticsData.revenue.data}
              total={analyticsData.revenue.total}
              average={analyticsData.revenue.average}
              trend={analyticsData.revenue.trend}
              isLoading={isLoading}
            />
          </div>

          {/* Tier Distribution */}
          <div className="chart-grid-item">
            <TierDistributionChart
              data={analyticsData.tierDistribution.data}
              total={analyticsData.tierDistribution.total}
              isLoading={isLoading}
            />
          </div>

          {/* Card Activity */}
          <div className="chart-grid-item">
            <CardActivityChart
              data={analyticsData.cardActivity.data}
              totalActive={analyticsData.cardActivity.totalActive}
              totalInactive={analyticsData.cardActivity.totalInactive}
              growthRate={analyticsData.cardActivity.growthRate}
              isLoading={isLoading}
            />
          </div>

          {/* Points Issued */}
          <div className="chart-grid-item full-width">
            <PointsIssuedChart
              data={analyticsData.pointsIssued.data}
              total={analyticsData.pointsIssued.total}
              average={analyticsData.pointsIssued.average}
              isLoading={isLoading}
            />
          </div>

          {/* Reward Popularity */}
          <div className="chart-grid-item full-width">
            <RewardPopularityChart
              data={analyticsData.rewardPopularity.data}
              total={analyticsData.rewardPopularity.total}
              isLoading={isLoading}
            />
          </div>

          {/* Top Customers Table */}
          <div className="chart-grid-item full-width">
            <div className="chart-container">
              <div className="chart-header">
                <div>
                  <h3>👥 Top Customers</h3>
                  <p className="chart-subtitle">Highest value customers</p>
                </div>
              </div>

              <div className="table-container">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Tier</th>
                      <th>Points</th>
                      <th>Total Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topCustomers.data.map((customer, index) => (
                      <tr key={customer.id} className={index < 3 ? 'top-customer' : ''}>
                        <td className="customer-name">
                          {index < 3 && <span className="rank-badge">#{index + 1}</span>}
                          {customer.name}
                        </td>
                        <td>
                          <span className="tier-badge" data-tier={customer.tier}>
                            {customer.tier}
                          </span>
                        </td>
                        <td className="points-cell">{customer.points.toLocaleString()}</td>
                        <td className="currency-cell">€{customer.spend.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdvancedAnalyticsPage;
