<template>
  <div class="transactions">
    <!-- Головка -->
    <section class="transactions-header">
      <h1 class="transactions-title">Листория транзакций</h1>
      <p class="transactions-subtitle">Все ваши транзакции и операции</p>
    </section>

    <!-- Фильтры -->
    <section class="filters-section">
      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label">Тип транзакции</label>
          <select v-model="filterType" class="filter-select">
            <option>Все</option>
            <option>Покупки</option>
            <option>Награды</option>
            <option>Бонусы</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Период</label>
          <select v-model="filterPeriod" class="filter-select">
            <option>Все часы</option>
            <option>Последние 30 дней</option>
            <option>Последние 3 месяца</option>
            <option>Всё время</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Поиск</label>
          <input v-model="searchQuery" type="text" class="filter-input" placeholder="Поиск транзакций" />
        </div>
      </div>
    </section>

    <!-- Статистика -->
    <section class="stats-section">
      <div class="stat">
        <div class="stat-label">Общее количество</div>
        <div class="stat-value">{{ totalTransactions }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Заработано баллов</div>
        <div class="stat-value positive">+{{ totalEarned }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Тратено баллов</div>
        <div class="stat-value negative">-{{ totalSpent }}</div>
      </div>
    </section>

    <!-- Лист транзакций -->
    <section class="transactions-list-section">
      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">Транзакций не найдено</p>
      </div>
      <div v-else class="transactions-timeline">
        <div v-for="(group, date) in groupedTransactions" :key="date" class="date-group">
          <div class="date-header">{{ formatDate(date) }}</div>
          <div class="transactions-items">
            <div v-for="tx in group" :key="tx.id" class="transaction-item">
              <div class="transaction-content">
                <div class="transaction-icon" :class="tx.type.toLowerCase()">
                  {{ tx.icon }}
                </div>
                <div class="transaction-info">
                  <div class="transaction-name">{{ tx.name }}</div>
                  <div class="transaction-category">{{ tx.category }}</div>
                </div>
              </div>
              <div class="transaction-amount" :class="tx.type.toLowerCase()">
                {{ tx.type === 'Earned' ? '+' : '-' }}{{ tx.amount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const filterType = ref('Все');
const filterPeriod = ref('Все часы');
const searchQuery = ref('');

const allTransactions = [
  {
    id: 1,
    icon: '🛍️',
    name: 'Онлайн покупка',
    category: 'Покупка',
    amount: 250,
    type: 'Earned',
    date: '2026-01-23',
  },
  {
    id: 2,
    icon: '🌟',
    name: 'Еженедельный бонус',
    category: 'Бонус',
    amount: 100,
    type: 'Earned',
    date: '2026-01-22',
  },
  {
    id: 3,
    icon: '🎁',
    name: 'Обмен на награду',
    category: 'Награда',
    amount: 500,
    type: 'Spent',
    date: '2026-01-21',
  },
  {
    id: 4,
    icon: '🏕️',
    name: 'Покупка в магазине',
    category: 'Покупка',
    amount: 150,
    type: 'Earned',
    date: '2026-01-20',
  },
  {
    id: 5,
    icon: '💳',
    name: 'Подарочные сертификаты',
    category: 'Награда',
    amount: 300,
    type: 'Spent',
    date: '2026-01-19',
  },
  {
    id: 6,
    icon: '🌟',
    name: 'Еженедельный бонус',
    category: 'Бонус',
    amount: 100,
    type: 'Earned',
    date: '2026-01-15',
  },
];

const filteredTransactions = computed(() => {
  return allTransactions.filter(tx => {
    let matches = true;
    
    if (filterType.value !== 'Все') {
      if (filterType.value === 'Покупки' && tx.category !== 'Покупка') matches = false;
      else if (filterType.value !== 'Покупки' && tx.category !== filterType.value) matches = false;
    }
    
    if (searchQuery.value && !tx.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      matches = false;
    }
    
    return matches;
  });
});

const groupedTransactions = computed(() => {
  const groups: Record<string, any[]> = {};
  
  filteredTransactions.value.forEach(tx => {
    if (!groups[tx.date]) {
      groups[tx.date] = [];
    }
    groups[tx.date].push(tx);
  });
  
  return groups;
});

const totalTransactions = computed(() => filteredTransactions.value.length);
const totalEarned = computed(() => 
  filteredTransactions.value
    .filter(tx => tx.type === 'Earned')
    .reduce((sum, tx) => sum + tx.amount, 0)
);
const totalSpent = computed(() => 
  filteredTransactions.value
    .filter(tx => tx.type === 'Spent')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
.transactions {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Головка */
.transactions-header {
  margin-bottom: var(--space-24);
}

.transactions-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-8) 0;
}

.transactions-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Фильтры */
.filters-section {
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-24);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-16);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.filter-select,
.filter-input {
  padding: var(--space-10);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-background);
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Статистика */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-16);
  margin-bottom: var(--space-24);
}

.stat {
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.stat-value.positive {
  color: var(--color-success);
}

.stat-value.negative {
  color: var(--color-error);
}

/* Лист транзакций */
.transactions-list-section {
  padding: var(--space-16);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.empty-state {
  text-align: center;
  padding: var(--space-32);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-16);
}

.empty-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Тимлайн */
.transactions-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.date-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border);
}

.transactions-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-12);
  background: var(--color-background);
  border-radius: var(--radius-base);
  transition: all var(--duration-normal) var(--ease-standard);
}

.transaction-item:hover {
  background: rgba(var(--color-primary-rgb, 33, 128, 141), 0.05);
}

.transaction-content {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 1;
}

.transaction-icon {
  font-size: var(--font-size-2xl);
  padding: var(--space-8);
  border-radius: var(--radius-base);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.transaction-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.transaction-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.transaction-amount {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.transaction-amount.earned {
  color: var(--color-success);
}

.transaction-amount.spent {
  color: var(--color-error);
}

@media (max-width: 640px) {
  .transactions {
    padding: var(--space-16);
  }

  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>
