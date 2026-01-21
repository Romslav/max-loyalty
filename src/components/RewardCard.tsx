import React, { useState } from 'react';
import Button from './ui/Button';
import { Card, CardContent, CardFooter } from './ui/Card';
import Modal from './ui/Modal';

interface Reward {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  pointsRequired: number;
  quantity?: number;
  quantityRedeemed: number;
  isFeatured?: boolean;
}

interface RewardCardProps {
  reward: Reward;
  currentPoints: number;
  onRedeem: (rewardId: string) => Promise<void>;
  onError?: (error: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  currentPoints,
  onRedeem,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const canRedeem = currentPoints >= reward.pointsRequired;
  const isSoldOut =
    reward.quantity && reward.quantityRedeemed >= reward.quantity;

  const handleRedeem = async () => {
    try {
      setLoading(true);
      await onRedeem(reward.id);
      setShowConfirm(false);
    } catch (error: any) {
      onError?.(error.message || 'Failed to redeem reward');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      FOOD: '#F59E0B',
      DISCOUNT: '#10B981',
      EXPERIENCE: '#8B5CF6',
      MERCHANDISE: '#EF4444',
    };
    return colors[category] || '#6B7280';
  };

  const getAvailabilityText = () => {
    if (isSoldOut) return 'Sold Out';
    if (reward.quantity) {
      const remaining = reward.quantity - reward.quantityRedeemed;
      return `${remaining} remaining`;
    }
    return 'Unlimited';
  };

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
        {reward.image && (
          <div
            style={{
              height: '160px',
              backgroundImage: `url(${reward.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            {reward.isFeatured && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#FCD34D',
                  color: '#78350F',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ⭐ Featured
              </div>
            )}
          </div>
        )}
        <CardContent className="pt-4">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              {reward.name}
            </h3>
            <span
              style={{
                backgroundColor: getCategoryColor(reward.category) + '20',
                color: getCategoryColor(reward.category),
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {reward.category}
            </span>
          </div>

          {reward.description && (
            <p
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: 1.5,
              }}
            >
              {reward.description}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                Points Required
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#3B82F6',
                }}
              >
                {reward.pointsRequired.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                {getAvailabilityText()}
              </p>
              {canRedeem && !isSoldOut && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#10B981',
                    fontWeight: 600,
                  }}
                >
                  You have enough!
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!canRedeem || isSoldOut || loading}
            className="w-full"
          >
            {isSoldOut ? 'Sold Out' : 'Redeem'}
          </Button>
        </CardFooter>
      </Card>

      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Confirm Redemption"
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              Redeem <strong>{reward.name}</strong> for{' '}
              <span style={{ color: '#3B82F6', fontWeight: 700 }}>
                {reward.pointsRequired.toLocaleString()} points
              </span>
              ?
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
              Your remaining points: <strong>{(currentPoints - reward.pointsRequired).toLocaleString()}</strong>
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRedeem}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Redeeming...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default RewardCard;
