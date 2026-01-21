import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TierBadge from '../components/ui/TierBadge';
import ProgressBar from '../components/ui/ProgressBar';
import AnimatedCard from '../components/ui/AnimatedCard';
import axiosInstance from '../services/api';
import { motion } from 'framer-motion';

interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface GuestCard {
  id: string;
  currentPoints: number;
  totalPointsEarned: number;
  tier: {
    name: string;
    level: number;
    color: string;
    minPointsRequired: number;
    pointsMultiplier: number;
  };
  createdAt: string;
}

interface Transaction {
  id: string;
  points: number;
  amount: number;
  createdAt: string;
  description: string;
}

interface Redemption {
  id: string;
  reward: {
    name: string;
    pointsRequired: number;
  };
  code: string;
  status: string;
  redeemedAt: string;
  usedAt?: string;
}

const CustomerPortalPage: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [card, setCard] = useState<GuestCard | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, cardRes, transRes, redemRes] = await Promise.all([
        axiosInstance.get('/api/auth/me'),
        axiosInstance.get('/api/cards/me'),
        axiosInstance.get('/api/cards/me/transactions').catch(() => ({ data: [] })),
        axiosInstance.get('/api/cards/me/redemptions').catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data);
      setCard(cardRes.data);
      setTransactions(transRes.data.slice(0, 10));
      setRedemptions(redemRes.data.slice(0, 10));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getNextTier = () => {
    if (!card?.tier) return null;
    const tierThresholds = [0, 1000, 5000, 15000];
    const currentIndex = tierThresholds.indexOf(card.tier.minPointsRequired);
    if (currentIndex >= 0 && currentIndex < tierThresholds.length - 1) {
      return tierThresholds[currentIndex + 1];
    }
    return null;
  };

  const nextTier = getNextTier();
  const pointsToNextTier = nextTier ? Math.max(0, nextTier - card!.currentPoints) : 0;

  return (
    <div style={{ padding: '24px' }}>
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
          <p style={{ color: '#6B7280' }}>Loading profile...</p>
        </div>
      ) : profile && card ? (
        <>
          {/* Hero Section */}
          <AnimatedCard>
            <Card
              style={{
                background: `linear-gradient(135deg, ${card.tier.color}20, ${card.tier.color}40)`,
                borderTop: `4px solid ${card.tier.color}`,
              }}
            >
              <CardContent style={{ padding: '32px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '24px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>
                      Welcome, {profile.firstName}! 🎆
                    </h1>
                    <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#6B7280' }}>
                      {profile.email}
                    </p>
                    <div style={{ marginTop: '16px' }}>
                      <TierBadge
                        tierName={card.tier.name.toUpperCase()}
                        tierLevel={card.tier.level}
                        size="lg"
                      />
                    </div>
                  </div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      fontSize: '80px',
                      opacity: 0.3,
                    }}
                  >
                    🎆
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Points Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginTop: '24px',
              marginBottom: '24px',
            }}
          >
            <AnimatedCard delay={0.1}>
              <Card>
                <CardContent style={{ padding: '24px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Current Points
                    </p>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: card.tier.color,
                      }}
                    >
                      {card.currentPoints.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card>
                <CardContent style={{ padding: '24px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Total Earned
                    </p>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#10B981',
                      }}
                    >
                      {card.totalPointsEarned.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card>
                <CardContent style={{ padding: '24px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                      Multiplier
                    </p>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#8B5CF6',
                      }}
                    >
                      {card.tier.pointsMultiplier}x
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>

          {/* Tier Progress */}
          <AnimatedCard delay={0.4}>
            <Card>
              <CardHeader>
                <h3 style={{ margin: 0 }}>Tier Progress</h3>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  current={card.currentPoints}
                  target={nextTier || card.tier.minPointsRequired + 5000}
                  label={`Progress to ${card.tier.level < 4 ? 'next tier' : 'maximum'}`}
                  color={card.tier.color}
                  showPercentage
                />
                {nextTier && (
                  <p
                    style={{
                      margin: '12px 0 0 0',
                      fontSize: '14px',
                      color: '#6B7280',
                    }}
                  >
                    {pointsToNextTier.toLocaleString()} points until next tier
                  </p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '0',
            }}
          >
            {['overview', 'transactions', 'redemptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: activeTab === tab ? `3px solid ${card.tier.color}` : 'none',
                  color: activeTab === tab ? card.tier.color : '#6B7280',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ marginTop: '24px' }}>
            {activeTab === 'overview' && (
              <Card>
                <CardContent style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0' }}>Account Info</h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        First Name
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                        {profile.firstName}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        Last Name
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                        {profile.lastName}
                      </p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        Member Since
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                        {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'transactions' && (
              <Card>
                <CardHeader>
                  <h3 style={{ margin: 0 }}>Recent Transactions</h3>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p style={{ color: '#6B7280' }}>No transactions yet</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          style={{
                            padding: '12px',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>
                              {tx.description}
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 700,
                                color: tx.points > 0 ? '#10B981' : '#EF4444',
                              }}
                            >
                              {tx.points > 0 ? '+' : ''}{tx.points} pts
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                              €{tx.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'redemptions' && (
              <Card>
                <CardHeader>
                  <h3 style={{ margin: 0 }}>Reward Redemptions</h3>
                </CardHeader>
                <CardContent>
                  {redemptions.length === 0 ? (
                    <p style={{ color: '#6B7280' }}>No redemptions yet</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {redemptions.map((red) => (
                        <div
                          key={red.id}
                          style={{
                            padding: '12px',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>
                              {red.reward.name}
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                              Code: {red.code}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                backgroundColor:
                                  red.status === 'USED'
                                    ? '#D1FAE5'
                                    : red.status === 'PENDING'
                                      ? '#FEF3C7'
                                      : '#FEE2E2',
                                color:
                                  red.status === 'USED'
                                    ? '#065F46'
                                    : red.status === 'PENDING'
                                      ? '#92400E'
                                      : '#991B1B',
                              }}
                            >
                              {red.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CustomerPortalPage;
