<template>
  <div class="preferences-display">
    <div class="preferences-grid">
      <!-- Communication Preferences Section -->
      <section class="preference-section">
        <h3 class="section-title">📧 Communication Preferences</h3>
        <div class="preference-items">
          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Email Notifications</h4>
              <p class="preference-description">Receive email updates about your loyalty account</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.emailNotifications"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">SMS Notifications</h4>
              <p class="preference-description">Receive text messages for important updates</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.smsNotifications"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Newsletter Subscription</h4>
              <p class="preference-description">Get exclusive offers and updates in your inbox</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.subscribeToNewsletter"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Loyalty Program Preferences Section -->
      <section class="preference-section">
        <h3 class="section-title">🏆 Loyalty Program Preferences</h3>
        <div class="preference-items">
          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Automatic Points Enrollment</h4>
              <p class="preference-description">Automatically enroll in new promotions</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.autoEnrollPromotions"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Birthday Rewards</h4>
              <p class="preference-description">Receive special birthday bonus points</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.birthdayRewards"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Referral Program</h4>
              <p class="preference-description">Participate in our referral program and earn rewards</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.referralProgram"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy & Data Section -->
      <section class="preference-section">
        <h3 class="section-title">🔒 Privacy & Data</h3>
        <div class="preference-items">
          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Personalized Recommendations</h4>
              <p class="preference-description">Allow us to show personalized offers based on your activity</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.personalizedRecommendations"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Data Analytics</h4>
              <p class="preference-description">Help us improve by sharing anonymous usage data</p>
            </div>
            <div class="preference-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  v-model="preferences.dataAnalytics"
                  @change="updatePreferences"
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Account Settings Section -->
      <section class="preference-section">
        <h3 class="section-title">⚙️ Account Settings</h3>
        <div class="preference-items">
          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Language</h4>
              <p class="preference-description">Choose your preferred language</p>
            </div>
            <div class="preference-select">
              <select v-model="preferences.language" @change="updatePreferences" class="select-control">
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div class="preference-item">
            <div class="preference-info">
              <h4 class="preference-name">Timezone</h4>
              <p class="preference-description">Set your timezone for activity reports</p>
            </div>
            <div class="preference-select">
              <select v-model="preferences.timezone" @change="updatePreferences" class="select-control">
                <option value="UTC">UTC</option>
                <option value="Europe/Moscow">Moscow (MSK)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Danger Zone Section -->
    <section class="danger-zone">
      <h3 class="section-title danger-title">⚠️ Danger Zone</h3>
      <div class="danger-items">
        <div class="danger-item">
          <div class="danger-info">
            <h4>Export Your Data</h4>
            <p>Download a copy of all your personal data</p>
          </div>
          <AppButton variant="secondary" size="sm" @click="exportData">
            Export Data
          </AppButton>
        </div>

        <div class="danger-item">
          <div class="danger-info">
            <h4>Delete Account</h4>
            <p>Permanently delete your account and all associated data</p>
          </div>
          <AppButton variant="secondary" size="sm" @click="showDeleteConfirm = true">
            Delete Account
          </AppButton>
        </div>
      </div>
    </section>

    <!-- Delete Confirmation Modal -->
    <AppModal
      v-if="showDeleteConfirm"
      title="Delete Account"
      variant="danger"
      @close="showDeleteConfirm = false"
    >
      <div class="delete-confirm">
        <p class="warning-text">⚠️ This action cannot be undone. All your data will be permanently deleted.</p>
        <p>Type <strong>DELETE</strong> to confirm:</p>
        <input
          v-model="deleteConfirmText"
          type="text"
          class="delete-input"
          placeholder="DELETE"
        />
        <div class="delete-actions">
          <AppButton
            variant="secondary"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            :disabled="deleteConfirmText !== 'DELETE'"
            @click="deleteAccount"
          >
            Delete My Account
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Success Alert -->
    <AppAlert
      v-if="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      closeable
      :model-value="showAlert"
      @update:model-value="() => (showAlert = false)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { User } from '@/domain/entities';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppModal from '@/presentation/components/common/AppModal.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';

interface Props {
  user: User;
}

defineProps<Props>();

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  subscribeToNewsletter: boolean;
  autoEnrollPromotions: boolean;
  birthdayRewards: boolean;
  referralProgram: boolean;
  personalizedRecommendations: boolean;
  dataAnalytics: boolean;
  language: string;
  timezone: string;
}

const preferences = reactive<UserPreferences>({
  emailNotifications: true,
  smsNotifications: false,
  subscribeToNewsletter: true,
  autoEnrollPromotions: true,
  birthdayRewards: true,
  referralProgram: true,
  personalizedRecommendations: true,
  dataAnalytics: false,
  language: 'en',
  timezone: 'UTC',
});

const showDeleteConfirm = ref(false);
const deleteConfirmText = ref('');
const showAlert = ref(false);
const alertType = ref<'success' | 'error'>('success');
const alertTitle = ref('');
const alertMessage = ref('');

/**
 * Update preferences
 */
async function updatePreferences(): Promise<void> {
  try {
    // API call to update preferences
    alertType.value = 'success';
    alertTitle.value = 'Success';
    alertMessage.value = 'Your preferences have been updated successfully!';
    showAlert.value = true;
  } catch (error) {
    alertType.value = 'error';
    alertTitle.value = 'Error';
    alertMessage.value = 'Failed to update preferences';
    showAlert.value = true;
  }
}

/**
 * Export user data
 */
function exportData(): void {
  // TODO: Implement data export functionality
  alertType.value = 'success';
  alertTitle.value = 'Export Started';
  alertMessage.value = 'Your data export has been started. You will receive an email with a download link shortly.';
  showAlert.value = true;
}

/**
 * Delete account
 */
function deleteAccount(): void {
  // TODO: Implement account deletion
  alertType.value = 'success';
  alertTitle.value = 'Account Deleted';
  alertMessage.value = 'Your account has been permanently deleted.';
  showAlert.value = true;
  showDeleteConfirm.value = false;
  deleteConfirmText.value = '';
}
</script>

<style scoped>
.preferences-display {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-24);
}

/* Preference Section */
.preference-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-20);
  background: var(--color-bg-1);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.preference-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  transition: all var(--duration-fast) var(--ease-standard);
}

.preference-item:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.02);
}

.preference-info {
  flex: 1;
}

.preference-name {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.preference-description {
  margin: var(--space-4) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Toggle Switch */
.preference-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast) var(--ease-standard);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: var(--color-surface);
  border-radius: 50%;
  transition: transform var(--duration-fast) var(--ease-standard);
  box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-switch {
  background: var(--color-primary);
}

.toggle-input:checked + .toggle-switch::after {
  transform: translateX(22px);
}

/* Select Control */
.preference-select {
  display: flex;
  align-items: center;
}

.select-control {
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  min-width: 150px;
}

.select-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

/* Danger Zone */
.danger-zone {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-20);
  background: rgba(var(--color-error-rgb), 0.05);
  border-radius: var(--radius-base);
  border: 2px solid rgba(var(--color-error-rgb), 0.2);
}

.danger-title {
  color: var(--color-error);
}

.danger-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(var(--color-error-rgb), 0.3);
}

.danger-info h4 {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.danger-info p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Delete Confirmation */
.delete-confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.warning-text {
  margin: 0;
  padding: var(--space-12);
  background: rgba(var(--color-error-rgb), 0.1);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-error);
  color: var(--color-error);
  font-weight: var(--font-weight-medium);
}

.delete-input {
  padding: var(--space-12);
  border: 2px solid var(--color-error);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.delete-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.2);
}

.delete-actions {
  display: flex;
  gap: var(--space-12);
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 1024px) {
  .preferences-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-12);
  }

  .preference-toggle,
  .preference-select {
    width: 100%;
  }

  .select-control {
    width: 100%;
    min-width: auto;
  }

  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-12);
  }
}
</style>
