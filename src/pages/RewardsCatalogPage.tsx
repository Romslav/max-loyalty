import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import RewardCard from '../components/RewardCard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import axiosInstance from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Reward {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  pointsRequired: number;
  quantity?: number;
  quantityRedeemed: number;
  validFrom: Date;
  validUntil: Date;
  isFeatured?: boolean;
}

const RewardsCatalogPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardsRes, cardRes] = await Promise.all([
        axiosInstance.get(`/api/rewards/restaurants/${restaurantId}`, {
          params: {
            category: selectedCategory || undefined,
          },
        }),
        axiosInstance.get('/api/cards/me'),
      ]);

      setRewards(rewardsRes.data.rewards);
      setCurrentPoints(cardRes.data.currentPoints);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    try {
      const cardRes = await axiosInstance.get('/api/cards/me');
      await axiosInstance.post(
        `/api/rewards/cards/${cardRes.data.id}/redeem`,
        { rewardId },
      );
      setCurrentPoints(currentPoints - (rewards.find(r => r.id === rewardId)?.pointsRequired || 0));
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to redeem reward');
    }
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

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
            Rewards Catalog
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>
            You have <strong>{currentPoints.toLocaleString()}</strong> points
          </p>
        </div>
        {isOwner && (
          <Button onClick={() => setShowCreateModal(true)}>+ Add Reward</Button>
        )}
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

      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {['', 'FOOD', 'DISCOUNT', 'EXPERIENCE', 'MERCHANDISE'].map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            style={{
              whiteSpace: 'nowrap',
              flex: '0 0 auto',
            }}
          >
            {cat || 'All Rewards'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: '#6B7280' }}>Loading rewards...</p>
        </div>
      ) : rewards.length === 0 ? (
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6B7280' }}>No rewards available</p>
          </CardContent>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              currentPoints={currentPoints}
              onRedeem={handleRedeem}
              onError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsCatalogPage;
