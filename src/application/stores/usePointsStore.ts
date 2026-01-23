/**
 * Points Store - Управление баллами и наградами
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface UserLevel {
  name: 'Bronze' | 'Silver' | 'Gold';
  requiredPoints: number;
  multiplier: number;
  benefits: string[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  image: string;
  limited: boolean;
  stock?: number;
}

interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
}

export const usePointsStore = defineStore('points', () => {
  // State
  const totalPoints = ref(1250);
  const currentLevel = ref<UserLevel>({
    name: 'Silver',
    requiredPoints: 1000,
    multiplier: 1.5,
    benefits: ['1.5x points', 'Priority support', 'Exclusive offers'],
  });
  const transactions = ref<PointsTransaction[]>([
    {
      id: 'tx-1',
      type: 'earned',
      amount: 250,
      description: 'Онлайн покупка',
      date: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      type: 'spent',
      amount: 500,
      description: 'Обмен на награду',
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const rewards = ref<Reward[]>([
    {
      id: 'r-1',
      name: 'Наушники Sony',
      description: 'Premium headphones with noise cancellation',
      points: 5000,
      category: 'Electronics',
      image: '🎧',
      limited: true,
      stock: 5,
    },
    {
      id: 'r-2',
      name: 'Кроссовки Nike',
      description: 'Latest Nike Air Max model',
      points: 3000,
      category: 'Fashion',
      image: '👟',
      limited: false,
    },
    {
      id: 'r-3',
      name: 'Нига «Атомные навыки»',
      description: 'Bestselling self-help book',
      points: 500,
      category: 'Books',
      image: '📚',
      limited: false,
    },
  ]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const progressToNextLevel = computed(() => {
    const nextLevelPoints = 2000;
    const progress = (totalPoints.value / nextLevelPoints) * 100;
    return Math.min(progress, 100);
  });

  const earnedPoints = computed(() => {
    return transactions.value
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const spentPoints = computed(() => {
    return transactions.value
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const availableRewards = computed(() => {
    return rewards.value.filter(r => r.points <= totalPoints.value && (!r.stock || r.stock > 0));
  });

  // Actions
  const addPoints = async (amount: number, description: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      totalPoints.value += amount;
      transactions.value.unshift({
        id: 'tx-' + Date.now(),
        type: 'earned',
        amount,
        description,
        date: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const spendPoints = async (amount: number, description: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      if (totalPoints.value < amount) {
        throw new Error('Недостаточно баллов');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      totalPoints.value -= amount;
      transactions.value.unshift({
        id: 'tx-' + Date.now(),
        type: 'spent',
        amount,
        description,
        date: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const redeemReward = async (rewardId: string) => {
    const reward = rewards.value.find(r => r.id === rewardId);
    if (!reward) {
      error.value = 'Награда не найдена';
      return false;
    }
    return spendPoints(reward.points, `Обмен на ${reward.name}`);
  };

  const setLevel = (level: UserLevel) => {
    currentLevel.value = level;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    totalPoints,
    currentLevel,
    transactions,
    rewards,
    isLoading,
    error,
    // Computed
    progressToNextLevel,
    earnedPoints,
    spentPoints,
    availableRewards,
    // Actions
    addPoints,
    spendPoints,
    redeemReward,
    setLevel,
    clearError,
  };
});
