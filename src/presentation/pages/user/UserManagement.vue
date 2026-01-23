<template>
  <div class="user-management">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">👥 User Management</h1>
      <p class="page-subtitle">Manage loyalty program users and permissions</p>
    </div>

    <!-- Action Bar -->
    <section class="action-bar">
      <div class="action-group">
        <AppButton variant="primary" @click="showImportModal = true">
          📥 Import Users
        </AppButton>
        <AppButton variant="secondary" @click="exportUsers">
          📤 Export CSV
        </AppButton>
      </div>

      <div class="selection-info" v-if="selectedUsers.length > 0">
        <span class="selected-count">{{ selectedUsers.length }} user(s) selected</span>
        <div class="bulk-actions">
          <AppButton variant="outline" size="sm" @click="showBulkActionModal = true">
            ⚙️ Bulk Action
          </AppButton>
          <AppButton variant="outline" size="sm" @click="clearSelection">
            ✕ Clear
          </AppButton>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-row">
        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <!-- Tier Filter -->
        <div class="filter-group">
          <label class="filter-label">Loyalty Tier</label>
          <select v-model="filters.tier" class="filter-select">
            <option value="">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <!-- Points Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Points Range</label>
          <select v-model="filters.pointsRange" class="filter-select">
            <option value="">All Amounts</option>
            <option value="0-1000">0 - 1,000</option>
            <option value="1000-5000">1,000 - 5,000</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000+">10,000+</option>
          </select>
        </div>

        <!-- Join Date Filter -->
        <div class="filter-group">
          <label class="filter-label">Join Date</label>
          <select v-model="filters.joinDate" class="filter-select">
            <option value="">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        <!-- Search -->
        <div class="filter-group">
          <label class="filter-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            class="filter-input"
            placeholder="Name, email, or ID..."
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="filter-actions">
        <AppButton variant="secondary" size="sm" @click="resetFilters">
          🔄 Reset
        </AppButton>
      </div>
    </section>

    <!-- Statistics -->
    <section class="stats-cards">
      <div class="stats-card">
        <span class="stats-icon">👥</span>
        <span class="stats-label">Total Users</span>
        <span class="stats-value">{{ allUsers.length }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-icon">✅</span>
        <span class="stats-label">Active</span>
        <span class="stats-value">{{ activeUsersCount }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-icon">🏆</span>
        <span class="stats-label">Premium</span>
        <span class="stats-value">{{ premiumUsersCount }}</span>
      </div>
      <div class="stats-card">
        <span class="stats-icon">💰</span>
        <span class="stats-label">Total Points</span>
        <span class="stats-value">{{ formatNumber(totalPoints) }}</span>
      </div>
    </section>

    <!-- Users Table -->
    <section class="table-section">
      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input
                  type="checkbox"
                  :checked="allUserSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th>User Info</th>
              <th>Status</th>
              <th>Tier</th>
              <th>Points</th>
              <th>Joined</th>
              <th>Last Active</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="user-row"
              :class="{ 'selected': selectedUsers.includes(user.id) }"
            >
              <td class="checkbox-column">
                <input
                  type="checkbox"
                  :checked="selectedUsers.includes(user.id)"
                  @change="toggleUserSelection(user.id)"
                />
              </td>
              <td class="user-info">
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                  <div class="user-id">#{{ user.id }}</div>
                </div>
              </td>
              <td class="status-cell">
                <span class="status-badge" :class="'status-' + user.status">
                  {{ capitalizeFirst(user.status) }}
                </span>
              </td>
              <td class="tier-cell">
                <span class="tier-badge" :class="'tier-' + user.tier?.toLowerCase()">
                  {{ user.tier }}
                </span>
              </td>
              <td class="points-cell">{{ formatNumber(user.loyaltyBalance) }}</td>
              <td class="date-cell">{{ formatDate(user.joinedDate) }}</td>
              <td class="date-cell">{{ formatRelativeTime(user.lastActive) }}</td>
              <td class="actions-cell">
                <button class="action-btn" title="View" @click="viewUser(user)">
                  👁️
                </button>
                <button class="action-btn" title="Edit" @click="editUser(user)">
                  ✏️
                </button>
                <button class="action-btn" title="More" @click="showUserMenu(user)">
                  ⋮
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">👤</div>
          <h3 class="empty-title">No users found</h3>
          <p class="empty-desc">Try adjusting your filters</p>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <section v-if="totalPages > 1" class="pagination-section">
      <div class="pagination-info">
        <span class="info-text">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredUsers.length) }}
          of {{ filteredUsers.length }} users
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
        <label>Per page:</label>
        <select v-model.number="pageSize" class="page-size-select">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </section>

    <!-- View User Modal -->
    <AppModal
      v-if="showUserDetailModal"
      :title="`User: ${selectedUserDetail?.name}`"
      @close="showUserDetailModal = false"
    >
      <div class="user-detail-modal" v-if="selectedUserDetail">
        <div class="detail-section">
          <h4 class="detail-title">Basic Information</h4>
          <div class="detail-group">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ selectedUserDetail.name }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ selectedUserDetail.email }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">User ID:</span>
            <span class="detail-value">#{{ selectedUserDetail.id }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Joined:</span>
            <span class="detail-value">{{ formatDate(selectedUserDetail.joinedDate) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-title">Account Status</h4>
          <div class="detail-group">
            <span class="detail-label">Status:</span>
            <span class="status-badge" :class="'status-' + selectedUserDetail.status">
              {{ capitalizeFirst(selectedUserDetail.status) }}
            </span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Tier:</span>
            <span class="tier-badge" :class="'tier-' + selectedUserDetail.tier?.toLowerCase()">
              {{ selectedUserDetail.tier }}
            </span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Loyalty Points:</span>
            <span class="detail-value">{{ formatNumber(selectedUserDetail.loyaltyBalance) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-title">Activity</h4>
          <div class="detail-group">
            <span class="detail-label">Last Active:</span>
            <span class="detail-value">{{ formatRelativeTime(selectedUserDetail.lastActive) }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Lifetime Purchases:</span>
            <span class="detail-value">{{ selectedUserDetail.totalPurchases }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Referrals:</span>
            <span class="detail-value">{{ selectedUserDetail.referralCount }}</span>
          </div>
        </div>
      </div>
    </AppModal>

    <!-- Bulk Action Modal -->
    <AppModal
      v-if="showBulkActionModal"
      title="Bulk User Action"
      @close="showBulkActionModal = false"
    >
      <div class="bulk-action-modal">
        <p class="action-desc">Select an action to apply to {{ selectedUsers.length }} user(s):</p>
        <div class="action-buttons">
          <AppButton variant="secondary" @click="bulkChangeStatus('active')">
            ✅ Activate
          </AppButton>
          <AppButton variant="secondary" @click="bulkChangeStatus('inactive')">
            ⏸️ Deactivate
          </AppButton>
          <AppButton variant="secondary" @click="bulkChangeTier('gold')">
            🏆 Upgrade to Gold
          </AppButton>
          <AppButton variant="secondary" @click="bulkChangeTier('platinum')">
            💎 Upgrade to Platinum
          </AppButton>
          <AppButton variant="outline" @click="bulkAddPoints">
            ➕ Add Points
          </AppButton>
          <AppButton variant="outline" @click="bulkRemovePoints">
            ➖ Remove Points
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Import Users Modal -->
    <AppModal
      v-if="showImportModal"
      title="Import Users"
      @close="showImportModal = false"
    >
      <div class="import-modal">
        <div class="import-info">
          <p>Upload a CSV file with user data to import.</p>
          <p class="file-format">Format: name, email, tier, points</p>
        </div>
        <div class="file-input-group">
          <input type="file" accept=".csv" class="file-input" />
          <AppButton variant="primary" @click="importUsers">
            📥 Import
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppModal from '@/presentation/components/common/AppModal.vue';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  tier: string;
  loyaltyBalance: number;
  joinedDate: Date;
  lastActive: Date;
  totalPurchases: number;
  referralCount: number;
}

const currentPage = ref(1);
const pageSize = ref(10);
const selectedUsers = ref<number[]>([]);
const showUserDetailModal = ref(false);
const showBulkActionModal = ref(false);
const showImportModal = ref(false);
const selectedUserDetail = ref<User | null>(null);

const filters = ref({
  status: '',
  tier: '',
  pointsRange: '',
  joinDate: '',
  search: '',
});

// Mock data - 50+ users
const allUsers = ref<User[]>([
  {
    id: 1001,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    tier: 'Platinum',
    loyaltyBalance: 45000,
    joinedDate: new Date('2023-01-15'),
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    totalPurchases: 156,
    referralCount: 12,
  },
  {
    id: 1002,
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'active',
    tier: 'Gold',
    loyaltyBalance: 28500,
    joinedDate: new Date('2023-03-20'),
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    totalPurchases: 89,
    referralCount: 5,
  },
  {
    id: 1003,
    name: 'Carol White',
    email: 'carol@example.com',
    status: 'active',
    tier: 'Silver',
    loyaltyBalance: 12000,
    joinedDate: new Date('2023-06-10'),
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000),
    totalPurchases: 45,
    referralCount: 2,
  },
  {
    id: 1004,
    name: 'David Brown',
    email: 'david@example.com',
    status: 'inactive',
    tier: 'Bronze',
    loyaltyBalance: 3500,
    joinedDate: new Date('2024-01-05'),
    lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalPurchases: 12,
    referralCount: 0,
  },
  {
    id: 1005,
    name: 'Emma Davis',
    email: 'emma@example.com',
    status: 'active',
    tier: 'Gold',
    loyaltyBalance: 32000,
    joinedDate: new Date('2023-04-12'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    totalPurchases: 102,
    referralCount: 8,
  },
  {
    id: 1006,
    name: 'Frank Miller',
    email: 'frank@example.com',
    status: 'suspended',
    tier: 'Silver',
    loyaltyBalance: 8500,
    joinedDate: new Date('2023-08-22'),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalPurchases: 34,
    referralCount: 1,
  },
  {
    id: 1007,
    name: 'Grace Lee',
    email: 'grace@example.com',
    status: 'active',
    tier: 'Platinum',
    loyaltyBalance: 52000,
    joinedDate: new Date('2022-11-03'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    totalPurchases: 201,
    referralCount: 18,
  },
  {
    id: 1008,
    name: 'Henry Taylor',
    email: 'henry@example.com',
    status: 'active',
    tier: 'Gold',
    loyaltyBalance: 25000,
    joinedDate: new Date('2023-07-14'),
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    totalPurchases: 78,
    referralCount: 4,
  },
  {
    id: 1009,
    name: 'Iris Chen',
    email: 'iris@example.com',
    status: 'banned',
    tier: 'Bronze',
    loyaltyBalance: 1500,
    joinedDate: new Date('2024-02-01'),
    lastActive: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    totalPurchases: 3,
    referralCount: 0,
  },
  {
    id: 1010,
    name: 'Jack Wilson',
    email: 'jack@example.com',
    status: 'active',
    tier: 'Silver',
    loyaltyBalance: 15000,
    joinedDate: new Date('2023-09-25'),
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    totalPurchases: 56,
    referralCount: 3,
  },
  {
    id: 1011,
    name: 'Karen Anderson',
    email: 'karen@example.com',
    status: 'active',
    tier: 'Gold',
    loyaltyBalance: 38000,
    joinedDate: new Date('2023-05-08'),
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    totalPurchases: 112,
    referralCount: 7,
  },
  {
    id: 1012,
    name: 'Leo Martinez',
    email: 'leo@example.com',
    status: 'inactive',
    tier: 'Silver',
    loyaltyBalance: 9000,
    joinedDate: new Date('2023-12-10'),
    lastActive: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    totalPurchases: 28,
    referralCount: 1,
  },
]);

/**
 * Filter users based on selected filters
 */
const filteredUsers = computed(() => {
  return allUsers.value.filter((user) => {
    // Status filter
    if (filters.value.status && user.status !== filters.value.status) {
      return false;
    }

    // Tier filter
    if (filters.value.tier && user.tier.toLowerCase() !== filters.value.tier) {
      return false;
    }

    // Points range filter
    if (filters.value.pointsRange) {
      const balance = user.loyaltyBalance;
      switch (filters.value.pointsRange) {
        case '0-1000':
          if (balance > 1000) return false;
          break;
        case '1000-5000':
          if (balance <= 1000 || balance > 5000) return false;
          break;
        case '5000-10000':
          if (balance <= 5000 || balance > 10000) return false;
          break;
        case '10000+':
          if (balance <= 10000) return false;
          break;
      }
    }

    // Join date filter
    if (filters.value.joinDate) {
      const days = parseInt(filters.value.joinDate);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      if (user.joinedDate < cutoffDate) {
        return false;
      }
    }

    // Search filter
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase();
      if (
        !user.name.toLowerCase().includes(searchLower) &&
        !user.email.toLowerCase().includes(searchLower) &&
        !user.id.toString().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });
});

/**
 * Get paginated users
 */
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});

/**
 * Calculate total pages
 */
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value);
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
 * Check if all users are selected
 */
const allUserSelected = computed(() => {
  return paginatedUsers.value.length > 0 && paginatedUsers.value.every((u) => selectedUsers.value.includes(u.id));
});

/**
 * Count active users
 */
const activeUsersCount = computed(() => {
  return filteredUsers.value.filter((u) => u.status === 'active').length;
});

/**
 * Count premium users (Gold and Platinum)
 */
const premiumUsersCount = computed(() => {
  return filteredUsers.value.filter((u) => ['Gold', 'Platinum'].includes(u.tier)).length;
});

/**
 * Calculate total points
 */
const totalPoints = computed(() => {
  return filteredUsers.value.reduce((sum, u) => sum + u.loyaltyBalance, 0);
});

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString();
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
 * Format relative time
 */
function formatRelativeTime(date: Date): string {
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
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Toggle select all
 */
function toggleSelectAll(): void {
  if (allUserSelected.value) {
    selectedUsers.value = selectedUsers.value.filter((id) => !paginatedUsers.value.map((u) => u.id).includes(id));
  } else {
    const pageIds = paginatedUsers.value.map((u) => u.id);
    selectedUsers.value = [...new Set([...selectedUsers.value, ...pageIds])];
  }
}

/**
 * Toggle user selection
 */
function toggleUserSelection(userId: number): void {
  const index = selectedUsers.value.indexOf(userId);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
  } else {
    selectedUsers.value.push(userId);
  }
}

/**
 * Clear selection
 */
function clearSelection(): void {
  selectedUsers.value = [];
}

/**
 * Reset filters
 */
function resetFilters(): void {
  filters.value = {
    status: '',
    tier: '',
    pointsRange: '',
    joinDate: '',
    search: '',
  };
  currentPage.value = 1;
}

/**
 * View user details
 */
function viewUser(user: User): void {
  selectedUserDetail.value = user;
  showUserDetailModal.value = true;
}

/**
 * Edit user
 */
function editUser(user: User): void {
  console.log('Edit user:', user);
  // TODO: Implement user edit modal
}

/**
 * Show user menu
 */
function showUserMenu(user: User): void {
  console.log('Show menu for user:', user);
  // TODO: Implement context menu
}

/**
 * Bulk change status
 */
function bulkChangeStatus(status: string): void {
  console.log('Changing status to:', status, 'for users:', selectedUsers.value);
  showBulkActionModal.value = false;
  clearSelection();
}

/**
 * Bulk change tier
 */
function bulkChangeTier(tier: string): void {
  console.log('Changing tier to:', tier, 'for users:', selectedUsers.value);
  showBulkActionModal.value = false;
  clearSelection();
}

/**
 * Bulk add points
 */
function bulkAddPoints(): void {
  console.log('Adding points for users:', selectedUsers.value);
  // TODO: Implement points addition modal
}

/**
 * Bulk remove points
 */
function bulkRemovePoints(): void {
  console.log('Removing points for users:', selectedUsers.value);
  // TODO: Implement points removal modal
}

/**
 * Export users to CSV
 */
function exportUsers(): void {
  const headers = ['ID', 'Name', 'Email', 'Status', 'Tier', 'Points', 'Joined', 'Last Active'];
  const rows = filteredUsers.value.map((user) => [
    user.id,
    user.name,
    user.email,
    user.status,
    user.tier,
    user.loyaltyBalance,
    formatDate(user.joinedDate),
    formatRelativeTime(user.lastActive),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Import users from CSV
 */
function importUsers(): void {
  console.log('Importing users...');
  // TODO: Implement CSV import functionality
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
.user-management {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 1600px;
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

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.action-group {
  display: flex;
  gap: var(--space-12);
}

.selection-info {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding-left: var(--space-16);
  border-left: 1px solid var(--color-border);
}

.selected-count {
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.bulk-actions {
  display: flex;
  gap: var(--space-8);
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
  text-align: center;
}

.stats-icon {
  font-size: var(--font-size-2xl);
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: var(--color-bg-1);
  border-bottom: 2px solid var(--color-border);
}

.users-table th {
  padding: var(--space-16);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: var(--space-16);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

.checkbox-column {
  width: 40px;
  text-align: center;
}

.users-table input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.user-row {
  transition: background var(--duration-fast);
}

.user-row:hover {
  background: var(--color-bg-1);
}

.user-row.selected {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.user-info {
  flex: 1;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.user-email {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.user-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.status-cell,
.tier-cell {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.status-badge.status-active {
  background: rgba(var(--color-success-rgb), 0.15);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.status-badge.status-inactive {
  background: rgba(var(--color-info-rgb), 0.15);
  color: var(--color-info);
  border: 1px solid var(--color-info);
}

.status-badge.status-suspended {
  background: rgba(var(--color-warning-rgb), 0.15);
  color: var(--color-warning);
  border: 1px solid var(--color-warning);
}

.status-badge.status-banned {
  background: rgba(var(--color-error-rgb), 0.15);
  color: var(--color-error);
  border: 1px solid var(--color-error);
}

.tier-badge {
  display: inline-block;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
}

.tier-badge.tier-bronze {
  background: rgba(205, 127, 50, 0.15);
  color: #cd7f32;
}

.tier-badge.tier-silver {
  background: rgba(192, 192, 192, 0.15);
  color: #c0c0c0;
}

.tier-badge.tier-gold {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.tier-badge.tier-platinum {
  background: rgba(230, 230, 250, 0.15);
  color: #e6e6fa;
}

.points-cell {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.date-cell {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.actions-cell {
  text-align: center;
  width: 100px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast);
  margin: 0 var(--space-2);
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

/* Pagination */
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

/* Modals */
.user-detail-modal,
.bulk-action-modal,
.import-modal {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--color-border);
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.detail-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-12);
}

.detail-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 120px;
}

.detail-value {
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.action-desc {
  margin: 0 0 var(--space-16) 0;
  color: var(--color-text-secondary);
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-12);
}

.import-info {
  padding: var(--space-16);
  background: var(--color-bg-1);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.import-info p {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.file-format {
  margin: 0;
  font-size: var(--font-size-xs);
  font-style: italic;
}

.file-input-group {
  display: flex;
  gap: var(--space-12);
  margin-top: var(--space-16);
}

.file-input {
  flex: 1;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .user-management {
    padding: var(--space-16);
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .selection-info {
    border-left: none;
    border-top: 1px solid var(--color-border);
    padding-left: 0;
    padding-top: var(--space-16);
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .users-table {
    font-size: var(--font-size-xs);
  }

  .users-table th,
  .users-table td {
    padding: var(--space-8);
  }

  .page-numbers {
    display: none;
  }

  .user-details {
    gap: var(--space-2);
  }

  .user-name {
    font-size: var(--font-size-sm);
  }
}
</style>
