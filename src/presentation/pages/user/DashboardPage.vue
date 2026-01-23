<template>
  <div class="dashboard">
    <!-- Головные статистики -->
    <section class="dashboard-header">
      <h1 class="dashboard-title">Кабинет</h1>
      <div class="dashboard-greeting">{{ greeting }}</div>
    </section>

    <!-- Карты статистики -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">{{ userStats.points }}</div>
        <div class="stat-label">Всего баллов</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">{{ userStats.level }}</div>
        <div class="stat-label">Ваш уровень</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎁</div>
        <div class="stat-value">{{ userStats.rewards }}</div>
        <div class="stat-label">Количество наград</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-value">${{ userStats.cashback }}</div>
        <div class="stat-label">Нароботано кэшбэка</div>
      </div>
    </div>

    <!-- Шкала прогресса -->
    <div class="progress-section">
      <h2 class="section-title">Подъем на следующий уровень</h2>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <p class="progress-text">{{ progressText }}</p>
    </div>

    <!-- Недавние транзакции -->
    <div class="transactions-section">
      <div class="section-header">
        <h2 class="section-title">Недавние транзакции</h2>
        <router-link to="/transactions" class="link">Посмотреть все</router-link>
      </div>
      <div class="transactions-list">
        <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
          <div class="transaction-info">
            <div class="transaction-icon">{{ tx.icon }}</div>
            <div class="transaction-details">
              <div class="transaction-name">{{ tx.name }}</div>
              <div class="transaction-date">{{ tx.date }}</div>
            </div>
          </div>
          <div class="transaction-amount">{{ tx.amount }} баллов</div>
        </div>
      </div>
    </div>

    <!-- Награды для обмена -->
    <div class="rewards-section">
      <div class="section-header">
        <h2 class="section-title">Доставки</h2>
        <router-link to="/rewards" class="link">Посмотреть все</router-link>
      </div>
      <div class="rewards-grid">
        <div v-for="reward in availableRewards" :key="reward.id" class="reward-card">
          <div class="reward-image">{{ reward.image }}</div>
          <h3 class="reward-name">{{ reward.name }}</h3>
          <p class="reward-points">{{ reward.points }} баллов</p>
          <button type="button" class="btn btn--primary btn--sm btn--full-width">
            Обменять
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const userStats = ref({
  points: 1250,
  level: 'Silver',
  rewards: 3,
  cashback: 85.50,
});

const transactions = [
  { id: 1, icon: '🛍️', name: 'Онлайн покупка', date: 'Вчера', amount: 250 },
  { id: 2, icon: '🏕️', name: 'Покупка в магазине', date: '2 дня назад', amount: 150 },
  { id: 3, icon: '💳', name: 'Выплата редения', date: '3 дня назад', amount: -100 },
];

const availableRewards = [
  { id: 1, image: '🎧', name: 'Наушники', points: 500 },
  { id: 2, image: '🏃', name: 'Кроссовки', points: 750 },
  { id: 3, image: '📚', name: 'Нига', points: 300 },
];

const currentPoints = 1250;
const nextLevelPoints = 2000;
const progressPoints = currentPoints;
const progressMax = nextLevelPoints;
const progressPercent = computed(() => (progressPoints / progressMax) * 100);

const progressText = computed(() => {
  const remaining = progressMax - progressPoints;
  return `Не хватает ещё ${remaining} баллов`;
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Доброе утро! 🌟';
  if (hour < 18) return 'На времени! 🎋';
  return 'Добрый вечер! 👋';
});
</script>

<style scoped>
.dashboard {
  padding: var(--space-24);
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--space-32);
}

.dashboard-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-8) 0;
}

.dashboard-greeting {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* Карты статистики */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-16);
  margin-bottom: var(--space-32);
}

.stat-card {
  padding: var(--space-20);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--duration-normal) var(--ease-standard);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-12);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-8);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Прогресс -->
.progress-section {
  padding: var(--space-24);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-32);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
}

.progress-bar {
  height: 8px;
  background: var(--color-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-12);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-teal-600) 100%);
  transition: width var(--duration-normal) var(--ease-standard);
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Недавние транзакции -->
.transactions-section {
  margin-bottom: var(--space-32);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-16);
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--duration-normal) var(--ease-standard);
}

.link:hover {
  color: var(--color-primary-hover);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
}

.transaction-info {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.transaction-icon {
  font-size: var(--font-size-2xl);
}

.transaction-details {
  display: flex;
  flex-direction: column;
}

.transaction-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.transaction-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.transaction-amount {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* Награды -->
.rewards-section {
  margin-bottom: var(--space-32);
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-16);
}

.reward-card {
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  transition: all var(--duration-normal) var(--ease-standard);
}

.reward-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.reward-image {
  font-size: var(--font-size-3xl);
}

.reward-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.reward-points {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

@media (max-width: 640px) {
  .dashboard {
    padding: var(--space-16);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .rewards-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
