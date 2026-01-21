import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import axiosInstance from '../services/api';

interface AnalyticsData {
  transactions: {
    total: number;
    totalRevenue: number;
    totalPointsIssued: number;
    averageOrderValue: number;
  };
  cards: {
    total: number;
    active: number;
    suspended: number;
    blocked: number;
  };
  points: {
    totalOutstanding: number;
  };
}

const AnalyticsDashboardPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/owner/restaurants/${restaurantId}/analytics`,
      );
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({
    label,
    value,
    icon,
    color,
  }: {
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <Card>
      <CardContent style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              {label}
            </p>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '28px',
                fontWeight: 700,
                color,
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>
          Analytics Dashboard
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>
          Real-time insights into your loyalty program
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: '#6B7280' }}>Loading analytics...</p>
        </div>
      ) : data ? (
        <>
          {/* Main Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <MetricCard
              label="Total Revenue"
              value={`€${data.transactions.totalRevenue.toFixed(2)}`}
              icon="💰"
              color="#3B82F6"
            />
            <MetricCard
              label="Transactions"
              value={data.transactions.total}
              icon="📊"
              color="#10B981"
            />
            <MetricCard
              label="Avg Order Value"
              value={`€${data.transactions.averageOrderValue.toFixed(2)}`}
              icon="📈"
              color="#F59E0B"
            />
            <MetricCard
              label="Points Issued"
              value={data.transactions.totalPointsIssued}
              icon="⭐"
              color="#8B5CF6"
            />
          </div>

          {/* Cards Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <Card>
              <CardHeader>
                <h3 style={{ margin: 0 }}>Guest Cards</h3>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Total
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#3B82F6',
                      }}
                    >
                      {data.cards.total}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Active
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#10B981',
                      }}
                    >
                      {data.cards.active}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Suspended
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#F59E0B',
                      }}
                    >
                      {data.cards.suspended}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Blocked
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#EF4444',
                      }}
                    >
                      {data.cards.blocked}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 style={{ margin: 0 }}>Points Overview</h3>
              </CardHeader>
              <CardContent>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                    Outstanding Points
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#8B5CF6',
                    }}
                  >
                    {data.points.totalOutstanding.toLocaleString()}
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '12px',
                      color: '#6B7280',
                    }}
                  >
                    Points waiting to be redeemed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <Card>
            <CardHeader>
              <h3 style={{ margin: 0 }}>Program Summary</h3>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '8px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#1E40AF',
                      fontWeight: 600,
                    }}
                  >
                    Active Rate
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#3B82F6',
                    }}
                  >
                    {data.cards.total > 0
                      ? ((data.cards.active / data.cards.total) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '8px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#15803D',
                      fontWeight: 600,
                    }}
                  >
                    Avg Points per Card
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#16A34A',
                    }}
                  >
                    {data.cards.total > 0
                      ? (data.points.totalOutstanding / data.cards.total).toFixed(0)
                      : 0}
                  </p>
                </div>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '8px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#92400E',
                      fontWeight: 600,
                    }}
                  >
                    Points per Transaction
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#D97706',
                    }}
                  >
                    {data.transactions.total > 0
                      ? (data.transactions.totalPointsIssued / data.transactions.total).toFixed(0)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default AnalyticsDashboardPage;
