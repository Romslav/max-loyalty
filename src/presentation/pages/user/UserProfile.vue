<template>
  <div class="user-profile">
    <!-- Header with avatar and basic info -->
    <section class="profile-header">
      <div class="profile-avatar-section">
        <div class="profile-avatar-container">
          <img
            :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name"
            :alt="user?.name"
            class="profile-avatar"
          />
          <button class="avatar-upload-btn" @click="showAvatarUpload = true" title="Change avatar">
            <span class="upload-icon">📷</span>
          </button>
        </div>
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-label">Tier</span>
            <span class="stat-value tier" :class="'tier-' + user?.loyaltyTier?.toLowerCase()">
              {{ user?.loyaltyTier || 'Bronze' }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Points</span>
            <span class="stat-value points">{{ user?.loyaltyBalance || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Member Since</span>
            <span class="stat-value date">{{ memberDate }}</span>
          </div>
        </div>
      </div>

      <div class="profile-info-section">
        <div>
          <h1 class="profile-name">{{ user?.name }}</h1>
          <p class="profile-email">{{ user?.email }}</p>
          <div class="profile-meta">
            <span v-if="user?.phoneNumber" class="meta-item">
              📞 {{ user.phoneNumber }}
            </span>
            <span class="meta-item">📅 Joined {{ memberDate }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <AppButton
            v-if="!isEditingProfile"
            variant="primary"
            size="sm"
            @click="isEditingProfile = true"
          >
            Edit Profile
          </AppButton>
          <div v-else class="edit-actions">
            <AppButton variant="primary" size="sm" @click="saveProfile" :loading="isSaving">
              Save Changes
            </AppButton>
            <AppButton variant="secondary" size="sm" @click="cancelEdit" :disabled="isSaving">
              Cancel
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Content with tabs -->
    <section class="profile-content">
      <AppTabs v-model="activeTab">
        <!-- Personal Information Tab -->
        <AppTab label="Personal Information" value="personal">
          <div class="tab-content">
            <UserSettingsForm
              v-if="user"
              :key="`user-settings-${editModeKey}`"
              @submitted="onSettingsSubmitted"
            />
          </div>
        </AppTab>

        <!-- Preferences Tab -->
        <AppTab label="Preferences" value="preferences">
          <div class="tab-content">
            <UserPreferencesDisplay v-if="user" :user="user" />
          </div>
        </AppTab>

        <!-- Security Tab -->
        <AppTab label="Security" value="security">
          <div class="tab-content">
            <SecuritySettings v-if="user" :user="user" />
          </div>
        </AppTab>
      </AppTabs>
    </section>

    <!-- Avatar Upload Modal -->
    <AppModal
      v-if="showAvatarUpload"
      title="Change Avatar"
      @close="showAvatarUpload = false"
    >
      <div class="avatar-upload-form">
        <p class="upload-hint">Upload a new profile picture</p>
        <input
          type="file"
          accept="image/*"
          class="file-input"
          @change="onAvatarSelected"
        />
        <p class="upload-note">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
      </div>
    </AppModal>

    <!-- Success Alert -->
    <AppAlert
      v-if="showSuccessAlert"
      type="success"
      title="Success"
      :message="successMessage"
      closeable
      :model-value="showSuccessAlert"
      @update:model-value="() => (showSuccessAlert = false)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUser } from '@/presentation/composables/useUser';
import UserSettingsForm from '@/presentation/components/forms/UserSettingsForm.vue';
import UserPreferencesDisplay from '@/presentation/components/user/UserPreferencesDisplay.vue';
import SecuritySettings from '@/presentation/components/user/SecuritySettings.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppTabs from '@/presentation/components/common/AppTabs.vue';
import AppTab from '@/presentation/components/common/AppTab.vue';
import AppModal from '@/presentation/components/common/AppModal.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';

const { user, updateUserProfile } = useUser();

const activeTab = ref<string>('personal');
const isEditingProfile = ref(false);
const showAvatarUpload = ref(false);
const isSaving = ref(false);
const editModeKey = ref(0);
const showSuccessAlert = ref(false);
const successMessage = ref('');

/**
 * Format member date
 */
const memberDate = computed(() => {
  if (!user.value?.createdAt) return 'Unknown';
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
});

/**
 * Handle avatar selection
 */
function onAvatarSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    successMessage.value = 'File size exceeds 5MB limit';
    showSuccessAlert.value = true;
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target?.result as string;
    try {
      isSaving.value = true;
      await updateUserProfile({ avatar: base64 });
      successMessage.value = 'Avatar updated successfully!';
      showSuccessAlert.value = true;
      showAvatarUpload.value = false;
    } finally {
      isSaving.value = false;
    }
  };
  reader.readAsDataURL(file);
}

/**
 * Handle settings form submission
 */
function onSettingsSubmitted(): void {
  successMessage.value = 'Profile settings updated successfully!';
  showSuccessAlert.value = true;
  isEditingProfile.value = false;
  editModeKey.value++;
}

/**
 * Save profile changes
 */
async function saveProfile(): Promise<void> {
  // Profile saving is handled by UserSettingsForm
  isEditingProfile.value = false;
}

/**
 * Cancel edit mode
 */
function cancelEdit(): void {
  isEditingProfile.value = false;
  editModeKey.value++;
}

/**
 * Load user data on mount
 */
onMounted(() => {
  // User data is loaded by useUser composable
});
</script>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Header Section */
.profile-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-32);
  padding: var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  align-items: start;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

.profile-avatar-container {
  position: relative;
  width: 150px;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-primary);
  display: block;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid var(--color-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  transition: all var(--duration-fast) var(--ease-standard);
  box-shadow: var(--shadow-md);
}

.avatar-upload-btn:hover {
  background: var(--color-primary-hover);
  transform: scale(1.1);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-16);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-12);
  background: var(--color-bg-1);
  border-radius: var(--radius-base);
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.stat-value.tier {
  font-size: var(--font-size-xl);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-sm);
  display: inline-block;
}

.stat-value.tier.tier-bronze {
  background: rgba(205, 127, 50, 0.15);
  color: #cd7f32;
}

.stat-value.tier.tier-silver {
  background: rgba(192, 192, 192, 0.15);
  color: #c0c0c0;
}

.stat-value.tier.tier-gold {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.stat-value.tier.tier-platinum {
  background: rgba(230, 230, 250, 0.15);
  color: #e6e6fa;
}

.profile-info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-16);
}

.profile-name {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.profile-email {
  margin: var(--space-4) 0 0 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-12);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.profile-actions {
  display: flex;
  gap: var(--space-12);
}

.edit-actions {
  display: flex;
  gap: var(--space-12);
}

/* Content Section */
.profile-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.tab-content {
  padding: var(--space-24);
}

/* Avatar Upload Modal */
.avatar-upload-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.upload-hint {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.file-input {
  padding: var(--space-16);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-bg-1);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.file-input:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.upload-note {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .user-profile {
    padding: var(--space-16);
    gap: var(--space-16);
  }

  .profile-header {
    padding: var(--space-16);
    gap: var(--space-16);
  }

  .profile-avatar-section {
    gap: var(--space-16);
  }

  .profile-stats {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }

  .profile-name {
    font-size: var(--font-size-2xl);
  }

  .profile-actions {
    flex-direction: column;
  }

  .tab-content {
    padding: var(--space-16);
  }
}
</style>
