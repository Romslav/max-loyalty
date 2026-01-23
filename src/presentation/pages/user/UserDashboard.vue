<template>
  <div class="user-dashboard">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome back, {{ user?.name }}! 👋</h1>
        <p class="welcome-subtitle">{{ getGreeting() }}</p>
      </div>
      <div class="welcome-badge" :class="'tier-' + user?.loyaltyTier?.toLowerCase()">
        <span class="badge-label">{{ user?.loyaltyTier || 'Member' }}</span>
        <span class="badge-icon">⭐</span>
      </div>
    </section>

    <!-- Quick Stats Grid -->
    <section class="stats-grid">
      <!-- Points Card -->
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3 class="stat-title">Loyalty Points</h3>
          <p class="stat-value">{{ formatNumber(user?.loyaltyBalance || 0) }}</p>
          <p class="stat-change" :class="{ 'positive': pointsThisMonth > 0 }">
            +{{ formatNumber(pointsThisMonth) }} this month
          </p>
        </div>
      </div>

      <!-- Tier Progress Card -->
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <h3 class="stat-title">Tier Progress</h3>
          <p class="stat-value">{{ tierProgress }}%</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: tierProgress + '%' }"></div>
          </div>
          <p class="stat-label">{{ pointsToNextTier }} points to next tier</p>
        </div>
      </div>

      <!-- Rank Card -->
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3 class="stat-title">Rank</h3>
          <p class="stat-value">#{{ userRank }}</p>
          <p class="stat-change">Top {{ rankPercentile }}%</p>
        </div>
      </div>

      <!-- Rewards Card -->
      <div class="stat-card">
        <div class="stat-icon">🎁</div>
        <div class="stat-content">
          <h3 class="stat-title">Available Rewards</h3>
          <p class="stat-value">{{ availableRewards }}</p>
          <AppButton variant="secondary" size="sm" @click="showRewards = true">
            Redeem Now
          </AppButton>
        </div>
      </div>
    </section>

    <!-- Charts Section -->
    <section class="charts-section">
      <!-- Points Earned This Month -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">📈 Points Earned This Month</h3>
          <select v-model="selectedMonth" class="month-select">
            <option value="january">January 2026</option>
            <option value="december">December 2025</option>
            <option value="november">November 2025</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <div class="simple-chart">
            <div class="chart-bar" v-for="day in 7" :key="day" 
                 :style="{ height: (Math.random() * 80 + 20) + '%' }">
              <span class="bar-label">Day {{ day }}</span>
            </div>
          </div>
          <p class="chart-total">Total this month: <strong>{{ formatNumber(pointsThisMonth) }}</strong></p>
        </div>
      </div>

      <!-- Points by Category -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">🍰 Points by Category</h3>
        </div>
        <div class="category-breakdown">
          <div class="category-item" v-for="category in pointCategories" :key="category.name">
            <div class="category-info">
              <span class="category-name">{{ category.name }}</span>
              <span class="category-percentage">{{ category.percentage }}%</span>
            </div>
            <div class="category-bar">
              <div class="category-fill" :style="{ width: category.percentage + '%', backgroundColor: category.color }"></div>
            </div>
            <span class="category-points">{{ formatNumber(category.points) }} pts</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity Section -->
    <section class="activity-section">
      <div class="section-header">
        <h3 class="section-title">📝 Recent Activity</h3>
        <router-link to="/user/history" class="view-all-link">View All →</router-link>
      </div>

      <div class="activity-list">
        <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
          <div class="activity-icon" :class="'type-' + activity.type">
            {{ activity.icon }}
          </div>
          <div class="activity-details">
            <h4 class="activity-title">{{ activity.title }}</h4>
            <p class="activity-time">{{ formatActivityTime(activity.date) }}</p>
          </div>
          <div class="activity-points" :class="{ 'positive': activity.points > 0 }">
            {{ activity.points > 0 ? '+' : '' }}{{ formatNumber(activity.points) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Recommended For You Section -->
    <section class="recommendations-section">
      <h3 class="section-title">⭐ Recommended For You</h3>
      <div class="recommendations-grid">
        <div class="recommendation-card" v-for="(offer, index) in recommendedOffers" :key="index">
          <div class="offer-badge">{{ offer.badge }}</div>
          <h4 class="offer-title">{{ offer.title }}</h4>
          <p class="offer-description">{{ offer.description }}</p>
          <div class="offer-footer">
            <span class="offer-points">{{ formatNumber(offer.pointsRequired) }} pts</span>
            <AppButton variant="primary" size="sm" @click="redeemOffer(offer)">
              Redeem
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions Section -->
    <section class="actions-section">
      <h3 class="section-title">⚡ Quick Actions</h3>
      <div class="actions-grid">
        <button class="action-card" @click="navigateTo('/invite-friend')">
          <div class="action-icon">👥</div>
          <span class="action-label">Invite a Friend</span>
          <p class="action-desc">Earn points for referrals</p>
        </button>
        <button class="action-card" @click="navigateTo('/redeem')">
          <div class="action-icon">🎁</div>
          <span class="action-label">Redeem Points</span>
          <p class="action-desc">Browse our catalog</p>
        </button>
        <button class="action-card" @click="navigateTo('/referrals')">
          <div class="action-icon">🔗</div>
          <span class="action-label">My Referrals</span>
          <p class="action-desc">Track your invites</p>
        </button>
        <button class="action-card" @click="navigateTo('/profile')">
          <div class="action-icon">👤</div>
          <span class="action-label">Edit Profile</span>
          <p class="action-desc">Update your info</p>
        </button>
      </div>
    </section>

    <!-- Rewards Modal -->
    <AppModal
      v-if="showRewards"
      title="Available Rewards"
      @close="showRewards = false"
    >
      <div class="rewards-modal">
        <p>You can redeem {{ availableRewards }} rewards from our catalog.</p>
        <AppButton variant="primary" @click="navigateTo('/redeem')">
          Browse Rewards
        </AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@/presentation/composables/useUser';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppModal from '@/presentation/components/common/AppModal.vue';

const router = useRouter();
const { user } = useUser();

const selectedMonth = ref('january');
const showRewards = ref(false);

// Mock data
const pointsThisMonth = ref(2450);
const userRank = ref(128);
const rankPercentile = ref(5);
const availableRewards = ref(3);
const pointsToNextTier = computed(() => {
  const tierPoints: Record<string, number> = {
    bronze: 5000,
    silver: 15000,
    gold: 30000,
    platinum: 50000,
  };
  const nextTierPoints = tierPoints[user.value?.loyaltyTier?.toLowerCase() || 'bronze'] || 5000;
  return Math.max(0, nextTierPoints - (user.value?.loyaltyBalance || 0));
});

const tierProgress = computed(() => {
  const tierPoints: Record<string, number> = {
    bronze: 5000,
    silver: 15000,
    gold: 30000,
    platinum: 50000,
  };
  const currentTierPoints = tierPoints[user.value?.loyaltyTier?.toLowerCase() || 'bronze'] || 5000;
  const percentage = Math.min(100, Math.floor(((user.value?.loyaltyBalance || 0) / currentTierPoints) * 100));
  return percentage;
});

const pointCategories = ref([
  { name: 'Purchases', percentage: 45, points: 1102, color: '#32b8c6' },
  { name: 'Referrals', percentage: 25, points: 612, color: '#ffd700' },
  { name: 'Birthday', percentage: 15, points: 367, color: '#ff5459' },
  { name: 'Activities', percentage: 15, points: 369, color: '#32b8c6' },
]);

const recentActivities = ref([
  {
    type: 'purchase',
    icon: '🛍️',
    title: 'Purchase at Coffee Shop',
    date: new Date(),
    points: 250,
  },
  {
    type: 'referral',
    icon: '👥',
    title: 'Friend referral bonus',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    points: 500,
  },
  {
    type: 'birthday',
    icon: '🎂',
    title: 'Birthday bonus',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    points: 250,
  },
  {
    type: 'redemption',
    icon: '🎁',
    title: 'Redeemed: Coffee Voucher',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    points: -1000,
  },
]);

const recommendedOffers = ref([
  {
    badge: 'HOT',
    title: 'Free Coffee',
    description: 'Get a free medium coffee at any location',
    pointsRequired: 500,
  },
  {
    badge: 'NEW',
    title: 'Movie Tickets',
    description: 'Two movie tickets for your favorite cinema',
    pointsRequired: 2000,
  },
  {
    badge: 'LIMITED',
    title: 'Exclusive Gift Set',
    description: 'Premium gift set available for members',
    pointsRequired: 5000,
  },
]);

/**
 * Get time-based greeting
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️ Good morning! Let\'s start your day.';
  if (hour < 18) return '☁️ Good afternoon! Keep earning points.';
  return '🌙 Good evening! Check out today\'s offers.';
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format activity time
 */
function formatActivityTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Navigate to page
 */
function navigateTo(path: string): void {
  router.push(path);
}

/**
 * Redeem offer
 */
function redeemOffer(offer: any): void {
  // TODO: Implement offer redemption
  console.log('Redeeming offer:', offer);
}
</script>

<style scoped>
.user-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-24);
  padding: var(--space-24);
  background: var(--color-bg-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.welcome-subtitle {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.welcome-badge {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-16) var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-base);
  border: 2px solid var(--color-border);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
}

.welcome-badge.tier-bronze {
  border-color: #cd7f32;
  color: #cd7f32;
}

.welcome-badge.tier-silver {
  border-color: #c0c0c0;
  color: #c0c0c0;
}

.welcome-badge.tier-gold {
  border-color: #ffd700;
  color: #ffd700;
}

.welcome-badge.tier-platinum {
  border-color: #e6e6fa;
  color: #e6e6fa;
}

.badge-label {
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badge-icon {
  font-size: var(--font-size-2xl);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-20);
}

.stat-card {
  display: flex;
  gap: var(--space-16);
  padding: var(--space-20);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-standard);
}

.stat-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: var(--font-size-3xl);
  display: flex;
  align-items: flex-start;
  min-width: 60px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: var(--space-8) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.stat-change {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-change.positive {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--space-8) 0;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-standard);
}

.stat-label {
  margin: var(--space-8) 0 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-20);
}

.chart-card {
  padding: var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
  margin-bottom: var(--space-20);
}

.chart-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.month-select {
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.month-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.simple-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: var(--space-8);
  padding: var(--space-16);
  background: var(--color-bg-1);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.chart-bar {
  flex: 1;
  background: var(--color-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--space-8);
  transition: background var(--duration-fast);
}

.chart-bar:hover {
  background: var(--color-primary-hover);
}

.bar-label {
  font-size: var(--font-size-xs);
  color: var(--color-btn-primary-text);
  font-weight: var(--font-weight-medium);
}

.chart-total {
  margin: 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Category Breakdown */
.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.category-percentage {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.category-bar {
  height: 20px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-standard);
}

.category-points {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Activity Section */
.activity-section {
  padding: var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
  margin-bottom: var(--space-20);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--duration-fast);
}

.view-all-link:hover {
  color: var(--color-primary-hover);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-12);
  background: var(--color-bg-1);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-title {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.activity-time {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.activity-points {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.activity-points.positive {
  color: var(--color-success);
}

/* Recommendations Section */
.recommendations-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-20);
}

.recommendation-card {
  position: relative;
  padding: var(--space-20);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-standard);
}

.recommendation-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.offer-badge {
  position: absolute;
  top: var(--space-12);
  right: var(--space-12);
  padding: var(--space-4) var(--space-8);
  background: var(--color-primary);
  color: var(--color-btn-primary-text);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.offer-title {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.offer-description {
  margin: 0 0 var(--space-16) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.offer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-12);
}

.offer-points {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* Actions Section */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-16);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-20);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.action-card:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  font-size: var(--font-size-3xl);
}

.action-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.action-desc {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

/* Rewards Modal */
.rewards-modal {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.rewards-modal p {
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .user-dashboard {
    padding: var(--space-16);
  }

  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
