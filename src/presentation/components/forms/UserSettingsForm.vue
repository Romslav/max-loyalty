<template>
  <form @submit.prevent="form.handleSubmit" class="user-settings-form">
    <h2 class="user-settings-form__title">Account Settings</h2>

    <!-- Profile Section -->
    <section class="user-settings-form__section">
      <h3 class="user-settings-form__section-title">Profile Information</h3>

      <!-- First Name -->
      <div class="form-group">
        <AppInput
          id="firstName"
          v-model="form.formData.firstName"
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          :error="form.getFieldError('firstName')"
          @blur="form.touchField('firstName')"
          @input="form.validateField('firstName')"
        />
      </div>

      <!-- Last Name -->
      <div class="form-group">
        <AppInput
          id="lastName"
          v-model="form.formData.lastName"
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          :error="form.getFieldError('lastName')"
          @blur="form.touchField('lastName')"
          @input="form.validateField('lastName')"
        />
      </div>

      <!-- Email -->
      <div class="form-group">
        <AppInput
          id="email"
          v-model="form.formData.email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          :error="form.getFieldError('email')"
          @blur="form.touchField('email')"
          @input="form.validateField('email')"
        />
      </div>

      <!-- Phone Number -->
      <div class="form-group">
        <AppInput
          id="phoneNumber"
          v-model="form.formData.phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          :error="form.getFieldError('phoneNumber')"
          @blur="form.touchField('phoneNumber')"
          @input="form.validateField('phoneNumber')"
        />
      </div>
    </section>

    <!-- Preferences Section -->
    <section class="user-settings-form__section">
      <h3 class="user-settings-form__section-title">Preferences</h3>

      <!-- Newsletter Opt-in -->
      <div class="form-group user-settings-form__checkbox-group">
        <label class="user-settings-form__checkbox">
          <input
            v-model="form.formData.subscribeToNewsletter"
            type="checkbox"
            @change="form.validateField('subscribeToNewsletter')"
          />
          <span>Subscribe to newsletter for exclusive offers and updates</span>
        </label>
      </div>

      <!-- Email Notifications -->
      <div class="form-group user-settings-form__checkbox-group">
        <label class="user-settings-form__checkbox">
          <input
            v-model="form.formData.emailNotifications"
            type="checkbox"
            @change="form.validateField('emailNotifications')"
          />
          <span>Receive email notifications for loyalty program updates</span>
        </label>
      </div>

      <!-- SMS Notifications -->
      <div class="form-group user-settings-form__checkbox-group">
        <label class="user-settings-form__checkbox">
          <input
            v-model="form.formData.smsNotifications"
            type="checkbox"
            @change="form.validateField('smsNotifications')"
          />
          <span>Receive SMS notifications for important updates</span>
        </label>
      </div>
    </section>

    <!-- Password Section -->
    <section class="user-settings-form__section">
      <h3 class="user-settings-form__section-title">Change Password</h3>

      <!-- Current Password -->
      <div class="form-group">
        <AppInput
          id="currentPassword"
          v-model="form.formData.currentPassword"
          label="Current Password (leave empty to skip)"
          type="password"
          placeholder="Enter your current password"
          :error="form.getFieldError('currentPassword')"
          @blur="form.touchField('currentPassword')"
          @input="form.validateField('currentPassword')"
        />
      </div>

      <!-- New Password -->
      <div v-if="form.formData.currentPassword" class="form-group">
        <AppInput
          id="newPassword"
          v-model="form.formData.newPassword"
          label="New Password"
          type="password"
          placeholder="Create a new password"
          :error="form.getFieldError('newPassword')"
          @blur="form.touchField('newPassword')"
          @input="form.validateField('newPassword')"
        />
        <div v-if="form.touched.newPassword" class="user-settings-form__hint">
          <p>Password must contain:</p>
          <ul>
            <li :class="{ 'met': hasUppercase }">At least one uppercase letter</li>
            <li :class="{ 'met': hasLowercase }">At least one lowercase letter</li>
            <li :class="{ 'met': hasNumber }">At least one number</li>
            <li :class="{ 'met': hasMinLength }">At least 8 characters</li>
          </ul>
        </div>
      </div>

      <!-- Confirm New Password -->
      <div v-if="form.formData.currentPassword" class="form-group">
        <AppInput
          id="confirmNewPassword"
          v-model="form.formData.confirmNewPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          :error="form.getFieldError('confirmNewPassword')"
          @blur="form.touchField('confirmNewPassword')"
          @input="form.validateField('confirmNewPassword')"
        />
      </div>
    </section>

    <!-- Error Alert -->
    <AppAlert
      v-if="form.submitError"
      type="error"
      title="Settings Error"
      :message="form.submitError"
      closeable
      :model-value="!!form.submitError"
      @update:model-value="() => (form.submitError = null)"
    />

    <!-- Success Alert -->
    <AppAlert
      v-if="showSuccessMessage"
      type="success"
      title="Success"
      message="Your settings have been updated successfully!"
      closeable
      :model-value="showSuccessMessage"
      @update:model-value="() => (showSuccessMessage = false)"
    />

    <!-- Action Buttons -->
    <div class="user-settings-form__actions">
      <AppButton
        type="submit"
        variant="primary"
        :loading="form.isSubmitting"
        :disabled="!form.isDirty"
      >
        {{ form.isSubmitting ? 'Saving...' : 'Save Changes' }}
      </AppButton>

      <AppButton
        type="button"
        variant="secondary"
        @click="form.reset"
        :disabled="form.isSubmitting"
      >
        Cancel
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from '@/presentation/composables/useForm';
import { useUser } from '@/presentation/composables/useUser';
import {
  required,
  email,
  phoneNumber,
  passwordStrength,
  matchField,
  minLength,
} from '@/presentation/utils/validators';
import AppInput from '@/presentation/components/common/AppInput.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';
import type { FormConfig } from '@/presentation/composables/useForm';

interface UserSettingsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subscribeToNewsletter: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const { updateUserProfile, changePassword } = useUser();
const showSuccessMessage = ref(false);

/**
 * Password strength indicators
 */
const newPassword = computed(() => form.formData.newPassword);
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value));
const hasLowercase = computed(() => /[a-z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const hasMinLength = computed(() => newPassword.value.length >= 8);

/**
 * Form configuration
 */
const userSettingsFormConfig: FormConfig = {
  firstName: {
    validators: [required('First name')],
    defaultValue: '',
  },
  lastName: {
    validators: [required('Last name')],
    defaultValue: '',
  },
  email: {
    validators: [required('Email'), email()],
    defaultValue: '',
  },
  phoneNumber: {
    validators: [(value: string) => (!value ? null : phoneNumber()(value))],
    defaultValue: '',
  },
  subscribeToNewsletter: {
    validators: [],
    defaultValue: false,
  },
  emailNotifications: {
    validators: [],
    defaultValue: false,
  },
  smsNotifications: {
    validators: [],
    defaultValue: false,
  },
  currentPassword: {
    validators: [],
    defaultValue: '',
  },
  newPassword: {
    validators: [
      (value: string) => {
        if (!form.formData.currentPassword) return null;
        if (!value) return 'New password is required when changing password';
        return passwordStrength()(value);
      },
    ],
    defaultValue: '',
  },
  confirmNewPassword: {
    validators: [
      (value: string) => {
        if (!form.formData.currentPassword) return null;
        if (!value) return 'Please confirm your new password';
        return matchField(form.formData.newPassword)(value);
      },
    ],
    defaultValue: '',
  },
};

/**
 * Handle form submission
 */
async function onSubmit(data: UserSettingsFormData) {
  const { currentPassword, newPassword, confirmNewPassword, ...profileData } = data;

  // Update profile
  const profileSuccess = await updateUserProfile(profileData);
  if (!profileSuccess) return;

  // Change password if provided
  if (currentPassword && newPassword) {
    const passwordSuccess = await changePassword({
      currentPassword,
      newPassword,
    });
    if (!passwordSuccess) return;
  }

  // Show success message
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
}

/**
 * Initialize form
 */
const form = useForm(userSettingsFormConfig, onSubmit);
</script>

<style scoped>
.user-settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 600px;
  padding: var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.user-settings-form__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.user-settings-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--color-border);
}

.user-settings-form__section:last-of-type {
  border-bottom: none;
}

.user-settings-form__section-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.user-settings-form__checkbox-group {
  gap: var(--space-8);
}

.user-settings-form__checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.user-settings-form__checkbox input {
  margin-top: var(--space-2);
  cursor: pointer;
  accent-color: var(--color-primary);
}

.user-settings-form__hint {
  padding: var(--space-8) var(--space-12);
  background: rgba(var(--color-info-rgb), 0.1);
  border-left: 3px solid var(--color-info);
  border-radius: var(--radius-sm);
}

.user-settings-form__hint p {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.user-settings-form__hint ul {
  margin: 0;
  padding-left: var(--space-16);
  list-style: none;
}

.user-settings-form__hint li {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.user-settings-form__hint li.met {
  color: var(--color-success);
}

.user-settings-form__hint li.met::before {
  content: '\2713 ';
  margin-right: var(--space-4);
}

.user-settings-form__actions {
  display: flex;
  gap: var(--space-16);
  margin-top: var(--space-8);
}

.user-settings-form__actions .btn {
  flex: 1;
}

@media (max-width: 640px) {
  .user-settings-form {
    padding: var(--space-16);
  }

  .user-settings-form__actions {
    flex-direction: column;
  }
}
</style>
