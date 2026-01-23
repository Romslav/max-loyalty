<template>
  <div class="rewards">
    <!-- Головка -->
    <section class="rewards-header">
      <h1 class="rewards-title">Награды и награботки</h1>
      <p class="rewards-subtitle">Цалог всех доступных наград</p>
    </section>

    <!-- Остаток баллов -->
    <div class="balance-card">
      <div class="balance-label">Ваш баланс</div>
      <div class="balance-amount">{{ userBalance }}</div>
      <div class="balance-unit">баллов</div>
    </div>

    <!-- Фильтры -->
    <section class="filters-section">
      <div class="filter-buttons">
        <button 
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="['filter-btn', { active: selectedCategory === cat }]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Каталог наград -->
    <section class="rewards-catalog">
      <div class="rewards-grid">
        <div v-for="reward in filteredRewards" :key="reward.id" class="reward-card">
          <div class="reward-image">{{ reward.image }}</div>
          <h3 class="reward-title">{{ reward.name }}</h3>
          <p class="reward-desc">{{ reward.description }}</p>
          <div class="reward-meta">
            <span class="reward-category">{{ reward.category }}</span>
            <span v-if="reward.limited" class="reward-limited">Ограниченная</span>
          </div>
          <div class="reward-footer">
            <div class="reward-points">
              <span class="points-label">баллов</span>
              <span class="points-value">{{ reward.points }}</span>
            </div>
            <button 
              type="button" 
              :disabled="reward.points > userBalance"
              :class="['btn', 'btn--primary', 'btn--sm', { disabled: reward.points > userBalance }]"
              @click="redeemReward(reward)"
            >
              Обменять
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Мои награды -->
    <section class="my-rewards-section">
      <h2 class="section-title">Мои полученные награды</h2>
      <div class="my-rewards-list">
        <div v-for="item in myRewards" :key="item.id" class="my-reward-item">
          <div class="my-reward-info">
            <div class="my-reward-icon">{{ item.image }}</div>
            <div class="my-reward-details">
              <div class="my-reward-name">{{ item.name }}</div>
              <div class="my-reward-date">Получено: {{ item.redeemedDate }}</div>
              <div class="my-reward-status" :class="item.status.toLowerCase()">
                {{ item.status }}
              </div>
            </div>
          </div>
          <button type="button" class="btn btn--secondary btn--sm">
            Подробности
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const userBalance = ref(1250);
const selectedCategory = ref('Все');

const categories = ['Все', 'Электроника', 'Книги', 'Красота', 'Выписки'];

const rewards = [
  {
    id: 1,
    image: '🎧',
    name: 'Наушники Sony WH-1000XM4',
    description: 'Новейшие наушники с шумоподавлением',
    category: 'Электроника',
    points: 5000,
    limited: true,
  },
  {
    id: 2,
    image: '🏃',
    name: 'Кроссовки Nike Air Max',
    description: 'Популярные спортивные кроссовки',
    category: 'Одежда',
    points: 3000,
    limited: false,
  },
  {
    id: 3,
    image: '📚',
    name: 'Книга «Атомные uнавыки»',
    description: 'Бестселлер по саморазвитию',
    category: 'Книги',
    points: 500,
    limited: false,
  },
  {
    id: 4,
    image: '💳',
    name: 'Подарок 500 руб',
    description: 'Подарочные сертификат на 500 руб.',
    category: 'Выписки',
    points: 1000,
    limited: false,
  },
];

const myRewards = [
  {
    id: 1,
    image: '🎈',
    name: 'Ежемесячный бонус',
    redeemedDate: '15 января 2026',
    status: 'Active',
  },
  {
    id: 2,
    image: '🎁',
    name: 'Новогодний подарок',
    redeemedDate: '31 декабря 2025',
    status: 'Used',
  },
];

const filteredRewards = computed(() => {
  if (selectedCategory.value === 'Все') {
    return rewards;
  }
  return rewards.filter(r => r.category === selectedCategory.value);
});

const redeemReward = (reward: any) => {
  if (reward.points <= userBalance.value) {
    userBalance.value -= reward.points;
    alert(`Награда "${reward.name}" успешно обменяна!`);
  }
};
</script>

<style scoped>
.rewards {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Головка */
.rewards-header {
  margin-bottom: var(--space-24);
}

.rewards-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-8) 0;
}

.rewards-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Баланс */
.balance-card {
  padding: var(--space-24);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal-600) 100%);
  color: white;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-bottom: var(--space-24);
}

.balance-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--space-8);
}

.balance-amount {
  font-size: 48px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  margin-bottom: var(--space-4);
}

.balance-unit {
  font-size: var(--font-size-base);
  opacity: 0.9;
}

/* Фильтры */
.filters-section {
  margin-bottom: var(--space-24);
}

.filter-buttons {
  display: flex;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-8) var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-normal) var(--ease-standard);
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Каталог -->
.rewards-catalog {
  margin-bottom: var(--space-32);
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-16);
}

.reward-card {
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
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
  font-size: 48px;
  text-align: center;
}

.reward-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.reward-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.reward-meta {
  display: flex;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.reward-category,
.reward-limited {
  font-size: var(--font-size-xs);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--color-secondary);
  color: var(--color-text);
}

.reward-limited {
  background: rgba(var(--color-error-rgb), 0.1);
  color: var(--color-error);
}

.reward-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-12);
}

.reward-points {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
}

.points-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.points-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Мои награды */
.my-rewards-section {
  border-top: 2px solid var(--color-border);
  padding-top: var(--space-24);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
}

.my-rewards-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.my-reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
}

.my-reward-info {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.my-reward-icon {
  font-size: var(--font-size-2xl);
}

.my-reward-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.my-reward-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.my-reward-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.my-reward-status {
  font-size: var(--font-size-xs);
  padding: var(--space-2) var(--space-8);
  border-radius: var(--radius-sm);
  display: inline-block;
  width: fit-content;
}

.my-reward-status.active {
  background: rgba(var(--color-success-rgb), 0.1);
  color: var(--color-success);
}

.my-reward-status.used {
  background: rgba(var(--color-info-rgb), 0.1);
  color: var(--color-info);
}

@media (max-width: 640px) {
  .rewards {
    padding: var(--space-16);
  }

  .rewards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .my-reward-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-12);
  }
}
</style>
