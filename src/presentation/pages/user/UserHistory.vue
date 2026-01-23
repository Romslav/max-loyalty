<template>
  <div class="user-history">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">📜 Activity History</h1>
      <p class="page-subtitle">Track all your loyalty points activities</p>
    </div>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-row">
        <!-- Activity Type Filter -->
        <div class="filter-group">
          <label class="filter-label">Activity Type</label>
          <select v-model="filters.type" class="filter-select">
            <option value="">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="referral">Referral</option>
            <option value="redemption">Redemption</option>
            <option value="bonus">Bonus</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <select v-model="filters.dateRange" class="filter-select">
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        <!-- Points Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Points Range</label>
          <select v-model="filters.pointsRange" class="filter-select">
            <option value="all">All Amounts</option>
            <option value="positive">Earned Only (+)</option>
            <option value="negative">Redeemed Only (-)</option>
          </select>
        </div>

        <!-- Search -->
        <div class="filter-group">
          <label class="filter-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            class="filter-input"
            placeholder="Search activities..."
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="filter-actions">
        <AppButton variant="secondary" size="sm" @click="resetFilters">
          Reset Filters
        </AppButton>
        <AppButton variant="primary" size="sm" @click="exportHistory">
          📥 Export CSV
        </AppButton>
      </div>
    </section>

    <!-- Statistics Cards -->
    <section class="stats-cards">
      <div class="stats-card">
        <span class="stats-label">Total Activities</span>
        <span class="stats-value">{{ filteredActivities.length }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-label">Points Earned</span>
        <span class="stats-value positive">+{{ formatNumber(totalEarned) }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-label">Points Redeemed</span>
        <span class="stats-value negative">-{{ formatNumber(totalRedeemed) }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-label">Net Points</span>
        <span class="stats-value" :class="netPoints >= 0 ? 'positive' : 'negative'">
          {{ netPoints >= 0 ? '+' : '' }}{{ formatNumber(netPoints) }}
        </span>
      </div>
    </section>

    <!-- Activity Table -->
    <section class="table-section">
      <div class="table-wrapper">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th class="points-column">Points</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(activity, index) in paginatedActivities"
              :key="index"
              class="activity-row"
              :class="{ 'positive-row': activity.points > 0, 'negative-row': activity.points < 0 }"
            >
              <td class="type-column">
                <div class="type-badge" :class="'type-' + activity.type">
                  {{ activity.icon }}
                </div>
              </td>
              <td class="description-column">
                <div class="activity-info">
                  <h4 class="activity-title">{{ activity.title }}</h4>
                  <p v-if="activity.merchant" class="activity-merchant">
                    {{ activity.merchant }}
                  </p>
                </div>
              </td>
              <td class="date-column">{{ formatDate(activity.date) }}</td>
              <td class="time-column">{{ formatTime(activity.date) }}</td>
              <td class="points-column" :class="{ 'positive': activity.points > 0 }">
                {{ activity.points > 0 ? '+' : '' }}{{ formatNumber(activity.points) }}
              </td>
              <td class="actions-column">
                <button class="action-btn" title="View details" @click="showActivityDetail(activity)">
                  👁️
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredActivities.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3 class="empty-title">No activities found</h3>
          <p class="empty-desc">Try adjusting your filters</p>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <section v-if="totalPages > 1" class="pagination-section">
      <div class="pagination-info">
        <span class="info-text">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredActivities.length) }}
          of {{ filteredActivities.length }} activities
        </span>
      </div>

      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          ← Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ 'active': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next →
        </button>
      </div>

      <div class="page-size-control">
        <label>Items per page:</label>
        <select v-model.number="pageSize" class="page-size-select">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppButton from '@/presentation/components/common/AppButton.vue';

interface Activity {
  type: string;
  icon: string;
  title: string;
  merchant?: string;
  date: Date;
  points: number;
  description: string;
}

const currentPage = ref(1);
const pageSize = ref(10);

const filters = ref({
  type: '',
  dateRange: 'all',
  pointsRange: 'all',
  search: '',
});

// Mock data - 50+ activities for pagination demo
const activities = ref<Activity[]>([
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Electronics Store',
    merchant: 'TechWorld, New York, NY',
    date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
    points: 580,
    description: 'Regular purchase',
  },
  {
    type: 'referral',
    icon: '👥',
    title: 'Friend Referral Bonus',
    merchant: 'John Doe',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    points: 1000,
    description: 'Successful referral',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Coffee Shop',
    merchant: 'Brew Haven, San Francisco, CA',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    points: 145,
    description: 'Coffee purchase',
  },
  {
    type: 'redemption',
    icon: '🎁',
    title: 'Redeemed: Premium Gift Card',
    merchant: 'Reward Center',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    points: -2500,
    description: 'Gift card redemption',
  },
  {
    type: 'bonus',
    icon: '🎉',
    title: 'Weekly Bonus Points',
    merchant: 'Loyalty Program',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    points: 250,
    description: 'Weekly bonus',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Clothing Store',
    merchant: 'Fashion Boutique, LA, CA',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    points: 890,
    description: 'Clothing purchase',
  },
  {
    type: 'birthday',
    icon: '🎂',
    title: 'Birthday Bonus',
    merchant: 'Loyalty Program',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    points: 500,
    description: 'Birthday gift',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Grocery Store',
    merchant: 'FreshMart, Seattle, WA',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    points: 320,
    description: 'Grocery shopping',
  },
  {
    type: 'redemption',
    icon: '🎁',
    title: 'Redeemed: Movie Tickets',
    merchant: 'Cinema Rewards',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    points: -1500,
    description: 'Movie tickets',
  },
  {
    type: 'bonus',
    icon: '🎉',
    title: 'Tier Upgrade Bonus',
    merchant: 'Loyalty Program',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    points: 1000,
    description: 'Tier upgrade bonus',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Restaurant',
    merchant: 'Gourmet Dining, Boston, MA',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    points: 450,
    description: 'Restaurant dining',
  },
  {
    type: 'referral',
    icon: '👥',
    title: 'Friend Referral Bonus',
    merchant: 'Jane Smith',
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    points: 1000,
    description: 'Successful referral',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Bookstore',
    merchant: 'Literary World, Chicago, IL',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    points: 220,
    description: 'Book purchase',
  },
  {
    type: 'bonus',
    icon: '🎉',
    title: 'Weekend Double Points',
    merchant: 'Loyalty Program',
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    points: 600,
    description: 'Weekend bonus',
  },
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Pharmacy',
    merchant: 'HealthCare Plus, Denver, CO',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    points: 85,
    description: 'Pharmacy purchase',
  },
]);

/**
 * Filter activities based on selected filters
 */
const filteredActivities = computed(() => {
  return activities.value.filter((activity) => {
    // Type filter
    if (filters.value.type && activity.type !== filters.value.type) {
      return false;
    }

    // Points range filter
    if (filters.value.pointsRange === 'positive' && activity.points <= 0) {
      return false;
    }
    if (filters.value.pointsRange === 'negative' && activity.points >= 0) {
      return false;
    }

    // Date range filter
    if (filters.value.dateRange !== 'all') {
      const days = parseInt(filters.value.dateRange);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      if (activity.date < cutoffDate) {
        return false;
      }
    }

    // Search filter
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      if (
        !activity.title.toLowerCase().includes(searchLower) &&
        !activity.merchant?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });
});

/**
 * Calculate total earned points
 */
const totalEarned = computed(() => {
  return filteredActivities.value
    .filter((a) => a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);
});

/**
 * Calculate total redeemed points
 */
const totalRedeemed = computed(() => {
  return Math.abs(
    filteredActivities.value
      .filter((a) => a.points < 0)
      .reduce((sum, a) => sum + a.points, 0)
  );
});

/**
 * Calculate net points
 */
const netPoints = computed(() => {
  return totalEarned.value - totalRedeemed.value;
});

/**
 * Calculate total pages
 */
const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / pageSize.value);
});

/**
 * Get paginated activities
 */
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredActivities.value.slice(start, end);
});

/**
 * Get visible page numbers
 */
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return Math.abs(num).toLocaleString();
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Reset filters
 */
function resetFilters(): void {
  filters.value = {
    type: '',
    dateRange: 'all',
    pointsRange: 'all',
    search: '',
  };
  currentPage.value = 1;
}

/**
 * Export history to CSV
 */
function exportHistory(): void {
  const headers = ['Type', 'Description', 'Date', 'Time', 'Points'];
  const rows = filteredActivities.value.map((activity) => [
    activity.type,
    activity.title,
    formatDate(activity.date),
    formatTime(activity.date),
    activity.points,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `activity-history-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Show activity detail
 */
function showActivityDetail(activity: Activity): void {
  console.log('Activity details:', activity);
  // TODO: Implement modal for activity details
}

/**
 * Go to specific page
 */
function goToPage(page: number): void {
  currentPage.value = page;
}

/**
 * Next page
 */
function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

/**
 * Previous page
 */
function previousPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<style scoped>
.user-history {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Page Header */
.page-header {
  padding: var(--space-24);
  background: var(--color-bg-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.page-title {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.page-subtitle {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

/* Filters Section */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-20);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.filters-row {
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
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.filter-actions {
  display: flex;
  gap: var(--space-12);
  justify-content: flex-end;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-16);
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.stats-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.stats-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.stats-value.positive {
  color: var(--color-success);
}

.stats-value.negative {
  color: var(--color-error);
}

/* Table Section */
.table-section {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table thead {
  background: var(--color-bg-1);
  border-bottom: 2px solid var(--color-border);
}

.activity-table th {
  padding: var(--space-16);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-table td {
  padding: var(--space-16);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

.activity-table tbody tr {
  transition: background var(--duration-fast);
}

.activity-table tbody tr:hover {
  background: var(--color-bg-1);
}

.activity-row.positive-row {
  border-left: 3px solid var(--color-success);
}

.activity-row.negative-row {
  border-left: 3px solid var(--color-error);
}

.type-column {
  width: 60px;
}

.type-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  background: var(--color-bg-1);
}

.description-column {
  flex: 1;
  min-width: 250px;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.activity-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.activity-merchant {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.date-column,
.time-column {
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.points-column {
  text-align: right;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.points-column.positive {
  color: var(--color-success);
}

.actions-column {
  text-align: center;
  width: 60px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast);
}

.action-btn:hover {
  background: var(--color-border);
}

.action-btn:focus {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-16);
  padding: var(--space-64);
  text-align: center;
}

.empty-icon {
  font-size: 64px;
}

.empty-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.empty-desc {
  margin: 0;
  color: var(--color-text-secondary);
}

/* Pagination Section */
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-24);
  padding: var(--space-20);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.pagination-info {
  flex: 1;
  min-width: 200px;
}

.info-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.pagination-btn {
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-fast);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-bg-1);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: var(--space-4);
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-fast);
}

.page-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-1);
}

.page-btn.active {
  background: var(--color-primary);
  color: var(--color-btn-primary-text);
  border-color: var(--color-primary);
}

.page-size-control {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-size: var(--font-size-sm);
}

.page-size-select {
  padding: var(--space-4) var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.page-size-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

/* Responsive */
@media (max-width: 1024px) {
  .pagination-section {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .user-history {
    padding: var(--space-16);
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .activity-table {
    font-size: var(--font-size-xs);
  }

  .activity-table th,
  .activity-table td {
    padding: var(--space-8);
  }

  .activity-title {
    font-size: var(--font-size-sm);
  }

  .page-numbers {
    display: none;
  }
}
</style>
