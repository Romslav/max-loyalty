<template>
  <div class="security-settings">
    <!-- Change Password Section -->
    <section class="security-section">
      <div class="section-header">
        <h3 class="section-title">🔐 Change Password</h3>
        <p class="section-description">Update your password to keep your account secure</p>
      </div>

      <div class="change-password-form">
        <!-- Current Password -->
        <div class="form-group">
          <AppInput
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            :error="passwordForm.errors.currentPassword"
            @blur="validatePasswordField('currentPassword')"
          />
        </div>

        <!-- New Password -->
        <div class="form-group">
          <AppInput
            id="newPassword"
            v-model="passwordForm.newPassword"
            label="New Password"
            type="password"
            placeholder="Create a new password"
            :error="passwordForm.errors.newPassword"
            @blur="validatePasswordField('newPassword')"
          />
          <div v-if="passwordForm.touched.newPassword" class="password-strength">
            <div class="strength-meter">
              <div class="strength-bar" :class="'strength-' + passwordStrength"></div>
            </div>
            <div class="strength-checklist">
              <p>Password must contain:</p>
              <ul>
                <li :class="{ 'met': hasUppercase }">✓ At least one uppercase letter</li>
                <li :class="{ 'met': hasLowercase }">✓ At least one lowercase letter</li>
                <li :class="{ 'met': hasNumber }">✓ At least one number</li>
                <li :class="{ 'met': hasMinLength }">✓ At least 8 characters</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="form-group">
          <AppInput
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter your new password"
            :error="passwordForm.errors.confirmPassword"
            @blur="validatePasswordField('confirmPassword')"
          />
        </div>

        <!-- Form Error -->
        <AppAlert
          v-if="passwordForm.submitError"
          type="error"
          title="Error"
          :message="passwordForm.submitError"
          closeable
          :model-value="!!passwordForm.submitError"
          @update:model-value="() => (passwordForm.submitError = null)"
        />

        <!-- Submit Button -->
        <AppButton
          type="button"
          variant="primary"
          @click="changePassword"
          :loading="passwordForm.isSubmitting"
          :disabled="!isPasswordFormValid"
        >
          {{ passwordForm.isSubmitting ? 'Updating...' : 'Update Password' }}
        </AppButton>
      </div>
    </section>

    <!-- Two-Factor Authentication Section -->
    <section class="security-section">
      <div class="section-header">
        <h3 class="section-title">🛡️ Two-Factor Authentication</h3>
        <p class="section-description">Add an extra layer of security to your account</p>
      </div>

      <div class="twofa-status">
        <div class="status-item">
          <div class="status-info">
            <h4>{{ twoFAEnabled ? 'Enabled' : 'Disabled' }}</h4>
            <p>{{ twoFAEnabled ? 'Your account is protected with 2FA' : 'Enable 2FA for additional security' }}</p>
          </div>
          <div class="status-indicator" :class="{ 'enabled': twoFAEnabled }">
            {{ twoFAEnabled ? '✓' : '○' }}
          </div>
        </div>
      </div>

      <AppButton
        v-if="!twoFAEnabled"
        type="button"
        variant="primary"
        @click="showTwoFASetup = true"
      >
        Enable Two-Factor Authentication
      </AppButton>
      <AppButton
        v-else
        type="button"
        variant="secondary"
        @click="showTwoFADisable = true"
      >
        Disable Two-Factor Authentication
      </AppButton>
    </section>

    <!-- Active Sessions Section -->
    <section class="security-section">
      <div class="section-header">
        <h3 class="section-title">📱 Active Sessions</h3>
        <p class="section-description">Manage devices where you're signed in</p>
      </div>

      <div class="sessions-list">
        <div class="session-item" v-for="(session, index) in activeSessions" :key="index">
          <div class="session-info">
            <h4 class="session-device">
              {{ session.deviceType }}
              <span v-if="session.isCurrent" class="current-badge">Current</span>
            </h4>
            <p class="session-details">
              {{ session.browser }} • {{ session.os }}
            </p>
            <p class="session-location">
              📍 {{ session.location }}
            </p>
            <p class="session-time">
              Last active: {{ formatSessionTime(session.lastActive) }}
            </p>
          </div>
          <AppButton
            v-if="!session.isCurrent"
            variant="secondary"
            size="sm"
            @click="signOutSession(index)"
          >
            Sign Out
          </AppButton>
        </div>
      </div>

      <AppButton
        type="button"
        variant="secondary"
        @click="signOutAllOtherSessions"
      >
        Sign Out From All Other Devices
      </AppButton>
    </section>

    <!-- Login Activity Section -->
    <section class="security-section">
      <div class="section-header">
        <h3 class="section-title">📊 Login Activity</h3>
        <p class="section-description">Recent login attempts on your account</p>
      </div>

      <div class="activity-list">
        <div class="activity-item" v-for="(activity, index) in loginActivity" :key="index">
          <div class="activity-icon" :class="'status-' + activity.status">
            {{ activity.status === 'success' ? '✓' : '✕' }}
          </div>
          <div class="activity-info">
            <p class="activity-title">
              {{ activity.status === 'success' ? 'Successful login' : 'Failed login attempt' }}
            </p>
            <p class="activity-details">
              {{ activity.ip }} • {{ activity.location }}
            </p>
            <p class="activity-time">
              {{ formatActivityTime(activity.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2FA Setup Modal -->
    <AppModal
      v-if="showTwoFASetup"
      title="Set Up Two-Factor Authentication"
      @close="showTwoFASetup = false"
    >
      <div class="twofa-setup">
        <p class="setup-step">Step 1: Install an authenticator app</p>
        <p class="setup-note">Download Google Authenticator, Microsoft Authenticator, or Authy</p>
        
        <p class="setup-step">Step 2: Scan the QR code</p>
        <div class="qr-code-placeholder">
          [QR Code would appear here]
        </div>
        
        <p class="setup-step">Step 3: Enter verification code</p>
        <input
          v-model="twoFACode"
          type="text"
          class="verification-input"
          placeholder="000000"
          maxlength="6"
        />
        
        <div class="setup-actions">
          <AppButton variant="secondary" @click="showTwoFASetup = false">
            Cancel
          </AppButton>
          <AppButton variant="primary" @click="enableTwoFA" :disabled="twoFACode.length !== 6">
            Verify & Enable
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- 2FA Disable Modal -->
    <AppModal
      v-if="showTwoFADisable"
      title="Disable Two-Factor Authentication"
      @close="showTwoFADisable = false"
    >
      <div class="twofa-disable">
        <AppAlert
          type="warning"
          title="Warning"
          message="Disabling 2FA will make your account less secure. Are you sure?"
        />
        <div class="disable-actions">
          <AppButton variant="secondary" @click="showTwoFADisable = false">
            Keep 2FA Enabled
          </AppButton>
          <AppButton variant="primary" @click="disableTwoFA">
            Disable 2FA
          </AppButton>
        </div>
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
import { ref, computed } from 'vue';
import type { User } from '@/domain/entities';
import AppInput from '@/presentation/components/common/AppInput.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';
import AppModal from '@/presentation/components/common/AppModal.vue';

interface Props {
  user: User;
}

defineProps<Props>();

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  errors: {
    currentPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  };
  touched: {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  };
  isSubmitting: boolean;
  submitError: string | null;
}

interface Session {
  deviceType: string;
  browser: string;
  os: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

interface Activity {
  status: 'success' | 'failed';
  ip: string;
  location: string;
  timestamp: Date;
}

const passwordForm = ref<PasswordFormState>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  errors: {
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  },
  touched: {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  },
  isSubmitting: false,
  submitError: null,
});

const twoFAEnabled = ref(false);
const showTwoFASetup = ref(false);
const showTwoFADisable = ref(false);
const twoFACode = ref('');
const showSuccessAlert = ref(false);
const successMessage = ref('');

const activeSessions = ref<Session[]>([
  {
    deviceType: '💻 Chrome on Windows',
    browser: 'Chrome 120',
    os: 'Windows 10',
    location: 'Moscow, Russia',
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    deviceType: '📱 Safari on iPhone',
    browser: 'Safari',
    os: 'iOS 17',
    location: 'Moscow, Russia',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isCurrent: false,
  },
]);

const loginActivity = ref<Activity[]>([
  {
    status: 'success',
    ip: '192.168.1.1',
    location: 'Moscow, Russia',
    timestamp: new Date(),
  },
  {
    status: 'failed',
    ip: '192.168.1.2',
    location: 'Unknown',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]);

/**
 * Password strength indicators
 */
const hasUppercase = computed(() => /[A-Z]/.test(passwordForm.value.newPassword));
const hasLowercase = computed(() => /[a-z]/.test(passwordForm.value.newPassword));
const hasNumber = computed(() => /[0-9]/.test(passwordForm.value.newPassword));
const hasMinLength = computed(() => passwordForm.value.newPassword.length >= 8);

const passwordStrength = computed(() => {
  let strength = 0;
  if (hasUppercase.value) strength++;
  if (hasLowercase.value) strength++;
  if (hasNumber.value) strength++;
  if (hasMinLength.value) strength++;
  
  if (strength === 0) return 'weak';
  if (strength <= 2) return 'fair';
  if (strength <= 3) return 'good';
  return 'strong';
});

/**
 * Check if password form is valid
 */
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasMinLength.value &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    !passwordForm.value.submitError
  );
});

/**
 * Validate password field
 */
function validatePasswordField(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
  passwordForm.value.touched[field] = true;

  const form = passwordForm.value;
  if (field === 'currentPassword') {
    form.errors.currentPassword = form.currentPassword.length < 6 ? 'Current password is required' : null;
  } else if (field === 'newPassword') {
    if (form.newPassword.length < 8) {
      form.errors.newPassword = 'Password must be at least 8 characters';
    } else if (!hasUppercase.value || !hasLowercase.value || !hasNumber.value) {
      form.errors.newPassword = 'Password does not meet strength requirements';
    } else {
      form.errors.newPassword = null;
    }
  } else if (field === 'confirmPassword') {
    form.errors.confirmPassword = form.confirmPassword !== form.newPassword ? 'Passwords do not match' : null;
  }
}

/**
 * Change password
 */
async function changePassword(): Promise<void> {
  try {
    passwordForm.value.isSubmitting = true;
    passwordForm.value.submitError = null;

    // TODO: Call API to change password
    await new Promise(resolve => setTimeout(resolve, 1000));

    successMessage.value = 'Password changed successfully!';
    showSuccessAlert.value = true;

    // Reset form
    passwordForm.value.currentPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmPassword = '';
    passwordForm.value.touched = {
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    };
  } catch (error) {
    passwordForm.value.submitError = 'Failed to change password';
  } finally {
    passwordForm.value.isSubmitting = false;
  }
}

/**
 * Enable 2FA
 */
async function enableTwoFA(): Promise<void> {
  try {
    // TODO: Call API to enable 2FA
    await new Promise(resolve => setTimeout(resolve, 1000));
    twoFAEnabled.value = true;
    showTwoFASetup.value = false;
    twoFACode.value = '';
    successMessage.value = 'Two-factor authentication enabled!';
    showSuccessAlert.value = true;
  } catch (error) {
    successMessage.value = 'Failed to enable 2FA';
    showSuccessAlert.value = true;
  }
}

/**
 * Disable 2FA
 */
async function disableTwoFA(): Promise<void> {
  try {
    // TODO: Call API to disable 2FA
    await new Promise(resolve => setTimeout(resolve, 1000));
    twoFAEnabled.value = false;
    showTwoFADisable.value = false;
    successMessage.value = 'Two-factor authentication disabled';
    showSuccessAlert.value = true;
  } catch (error) {
    successMessage.value = 'Failed to disable 2FA';
    showSuccessAlert.value = true;
  }
}

/**
 * Format session time
 */
function formatSessionTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Format activity time
 */
function formatActivityTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Sign out session
 */
function signOutSession(index: number): void {
  activeSessions.value.splice(index, 1);
  successMessage.value = 'Session terminated successfully';
  showSuccessAlert.value = true;
}

/**
 * Sign out from all other sessions
 */
function signOutAllOtherSessions(): void {
  activeSessions.value = activeSessions.value.filter(s => s.isCurrent);
  successMessage.value = 'Signed out from all other devices';
  showSuccessAlert.value = true;
}
</script>

<style scoped>
.security-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

/* Security Section */
.security-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-20);
  background: var(--color-bg-1);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.section-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Change Password Form */
.change-password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* Password Strength */
.password-strength {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.strength-meter {
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 25%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal), background-color var(--duration-normal);
}

.strength-bar.strength-weak {
  width: 25%;
  background: var(--color-error);
}

.strength-bar.strength-fair {
  width: 50%;
  background: var(--color-warning);
}

.strength-bar.strength-good {
  width: 75%;
  background: var(--color-info);
}

.strength-bar.strength-strong {
  width: 100%;
  background: var(--color-success);
}

.strength-checklist {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.strength-checklist p {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.strength-checklist ul {
  margin: 0;
  padding-left: var(--space-16);
  list-style: none;
}

.strength-checklist li {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.strength-checklist li.met {
  color: var(--color-success);
}

/* 2FA Status */
.twofa-status {
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
}

.status-info h4 {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.status-info p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.status-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  background: rgba(var(--color-error-rgb), 0.1);
  color: var(--color-error);
  border: 2px solid var(--color-error);
}

.status-indicator.enabled {
  background: rgba(var(--color-success-rgb), 0.1);
  color: var(--color-success);
  border-color: var(--color-success);
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-16);
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.session-device {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.current-badge {
  display: inline-block;
  padding: var(--space-2) var(--space-8);
  background: rgba(var(--color-primary-rgb), 0.2);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.session-details,
.session-location,
.session-time {
  margin: var(--space-4) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
}

.activity-item {
  display: flex;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--color-surface);
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
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  background: rgba(var(--color-error-rgb), 0.1);
  color: var(--color-error);
}

.activity-icon.status-success {
  background: rgba(var(--color-success-rgb), 0.1);
  color: var(--color-success);
}

.activity-title {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.activity-details,
.activity-time {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 2FA Setup Modal */
.twofa-setup,
.twofa-disable {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.setup-step {
  margin: 0 0 var(--space-4) 0;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.setup-note {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.qr-code-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-1);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-base);
  color: var(--color-text-secondary);
  margin: var(--space-8) 0;
}

.verification-input {
  padding: var(--space-12);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-lg);
  letter-spacing: 4px;
  text-align: center;
  font-family: monospace;
}

.verification-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.setup-actions,
.disable-actions {
  display: flex;
  gap: var(--space-12);
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .session-item,
  .activity-item {
    flex-direction: column;
  }

  .setup-actions,
  .disable-actions {
    flex-direction: column;
  }
}
</style>
