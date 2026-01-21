import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import TierBadge from '../components/ui/TierBadge';
import AnimatedCard from '../components/ui/AnimatedCard';
import axiosInstance from '../services/api';

interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  color: string;
  minPointsRequired: number;
  pointsMultiplier: number;
  bonusPointsPerMonth: number;
  discountPercentage: number;
  features: string[];
  isActive: boolean;
  isDefault: boolean;
}

const LoyaltyTiersPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTier, setNewTier] = useState({
    name: '',
    level: 1,
    minPointsRequired: 0,
    pointsMultiplier: 1.0,
    bonusPointsPerMonth: 0,
    discountPercentage: 0,
    color: '#FFD700',
    features: [] as string[],
  });

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/loyalty-tiers/restaurants/${restaurantId}`,
      );
      setTiers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTier = async () => {
    try {
      await axiosInstance.post(
        `/api/loyalty-tiers/restaurants/${restaurantId}`,
        newTier,
      );
      setShowCreateModal(false);
      setNewTier({
        name: '',
        level: 1,
        minPointsRequired: 0,
        pointsMultiplier: 1.0,
        bonusPointsPerMonth: 0,
        discountPercentage: 0,
        color: '#FFD700',
        features: [],
      });
      loadTiers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create tier');
    }
  };

  const sortedTiers = [...tiers].sort((a, b) => a.level - b.level);

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>
            Loyalty Tiers
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>
            Manage customer loyalty levels and benefits
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ Create Tier</Button>
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
          <p style={{ color: '#6B7280' }}>Loading tiers...</p>
        </div>
      ) : sortedTiers.length === 0 ? (
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6B7280', marginBottom: '16px' }}>
              No loyalty tiers created yet
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create First Tier
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {sortedTiers.map((tier, index) => (
            <AnimatedCard key={tier.id} delay={index * 0.1} hoverEffect="lift">
              <Card
                style={{
                  borderTop: `4px solid ${tier.color}`,
                  height: '100%',
                }}
              >
                <CardContent style={{ padding: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '24px',
                          fontWeight: 700,
                          color: tier.color,
                        }}
                      >
                        {tier.name}
                      </h3>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '14px',
                          color: '#6B7280',
                        }}
                      >
                        Level {tier.level}
                      </p>
                    </div>
                    {tier.isDefault && (
                      <span
                        style={{
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                      padding: '16px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        Min Points
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: tier.color,
                        }}
                      >
                        {tier.minPointsRequired.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                        Point Multiplier
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: tier.color,
                        }}
                      >
                        {tier.pointsMultiplier}x
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                      padding: '12px',
                      backgroundColor: '#EFF6FF',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#1E40AF' }}>
                        Bonus Points/Month
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#1E40AF',
                        }}
                      >
                        +{tier.bonusPointsPerMonth}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#1E40AF' }}>
                        Extra Discount
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#1E40AF',
                        }}
                      >
                        +{tier.discountPercentage}%
                      </p>
                    </div>
                  </div>

                  {tier.features.length > 0 && (
                    <div>
                      <p
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#6B7280',
                        }}
                      >
                        Features
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {tier.features.map((feature) => (
                          <span
                            key={feature}
                            style={{
                              backgroundColor: `${tier.color}20`,
                              color: tier.color,
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          >
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      )}

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Loyalty Tier"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Tier Name"
              placeholder="e.g., Gold"
              value={newTier.name}
              onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
            />
            <Input
              label="Level"
              type="number"
              min="1"
              max="10"
              value={newTier.level}
              onChange={(e) =>
                setNewTier({ ...newTier, level: parseInt(e.target.value) })
              }
            />
            <Input
              label="Min Points Required"
              type="number"
              min="0"
              value={newTier.minPointsRequired}
              onChange={(e) =>
                setNewTier({
                  ...newTier,
                  minPointsRequired: parseInt(e.target.value),
                })
              }
            />
            <Input
              label="Points Multiplier"
              type="number"
              min="1"
              step="0.1"
              value={newTier.pointsMultiplier}
              onChange={(e) =>
                setNewTier({
                  ...newTier,
                  pointsMultiplier: parseFloat(e.target.value),
                })
              }
            />
            <Input
              label="Bonus Points/Month"
              type="number"
              min="0"
              value={newTier.bonusPointsPerMonth}
              onChange={(e) =>
                setNewTier({
                  ...newTier,
                  bonusPointsPerMonth: parseInt(e.target.value),
                })
              }
            />
            <Input
              label="Extra Discount %"
              type="number"
              min="0"
              max="100"
              value={newTier.discountPercentage}
              onChange={(e) =>
                setNewTier({
                  ...newTier,
                  discountPercentage: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTier}>Create Tier</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoyaltyTiersPage;
