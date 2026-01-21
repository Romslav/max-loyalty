import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import axiosInstance from '../services/api';

interface GuestCard {
  id: string;
  guestName?: string;
  currentPoints: number;
  totalPointsEarned: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
  tier?: {
    name: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

const OwnerGuestCardsPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [cards, setCards] = useState<GuestCard[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<GuestCard | null>(null);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [bonusReason, setBonusReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    loadCards();
  }, [currentPage]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const response = await axiosInstance.get(
        `/owner/restaurants/${restaurantId}/guest-cards`,
        {
          params: { limit, offset },
        },
      );
      setCards(response.data.cards);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendCard = async (cardId: string) => {
    try {
      await axiosInstance.put(
        `/owner/restaurants/${restaurantId}/guest-cards/${cardId}/suspend`,
      );
      loadCards();
    } catch (err) {
      setError('Failed to suspend card');
    }
  };

  const handleBlockCard = async (cardId: string) => {
    try {
      await axiosInstance.put(
        `/owner/restaurants/${restaurantId}/guest-cards/${cardId}/block`,
      );
      loadCards();
    } catch (err) {
      setError('Failed to block card');
    }
  };

  const handleAddBonus = async () => {
    if (!selectedCard) return;

    try {
      await axiosInstance.post(
        `/owner/restaurants/${restaurantId}/guest-cards/${selectedCard.id}/add-bonus`,
        {
          points: bonusPoints,
          reason: bonusReason,
        },
      );
      setShowBonusModal(false);
      setBonusPoints(0);
      setBonusReason('');
      loadCards();
    } catch (err) {
      setError('Failed to add bonus points');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Guest Cards Management</h1>
        <p className="text-gray-600 mt-2">Manage customer loyalty cards and rewards</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading guest cards...</p>
        </div>
      ) : cards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No guest cards yet</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold">Points</th>
                  <th className="text-left px-6 py-3 font-semibold">Tier</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold">Created</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {card.user ? (
                        <div>
                          <p className="font-medium">
                            {card.user.firstName} {card.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{card.user.email}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{card.guestName || 'Guest'}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{card.currentPoints}</p>
                      <p className="text-sm text-gray-600">
                        Earned: {card.totalPointsEarned}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{card.tier?.name || 'Standard'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getStatusBadgeColor(card.status)
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCard(card);
                          setShowBonusModal(true);
                        }}
                      >
                        Add Bonus
                      </Button>
                      {card.status === 'ACTIVE' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 border-yellow-600"
                            onClick={() => handleSuspendCard(card.id)}
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                            onClick={() => handleBlockCard(card.id)}
                          >
                            Block
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-center">
                Page {currentPage} of {pagination.pages}
              </span>
              <Button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {showBonusModal && selectedCard && (
        <Modal
          isOpen={showBonusModal}
          onClose={() => setShowBonusModal(false)}
          title="Add Bonus Points"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bonus Points</label>
              <Input
                type="number"
                min="1"
                value={bonusPoints}
                onChange={(e) => setBonusPoints(Number(e.target.value))}
                placeholder="Enter bonus points"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reason</label>
              <Input
                value={bonusReason}
                onChange={(e) => setBonusReason(e.target.value)}
                placeholder="Why are you adding bonus points?"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowBonusModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBonus} disabled={bonusPoints === 0}>
                Add Bonus
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OwnerGuestCardsPage;
