<template>
  <form @submit.prevent="form.handleSubmit" class="guest-form">
    <h2 class="guest-form__title">{{ isEditMode ? 'Edit Guest' : 'Add New Guest' }}</h2>

    <!-- Personal Information Section -->
    <section class="guest-form__section">
      <h3 class="guest-form__section-title">Personal Information</h3>

      <div class="guest-form__row">
        <!-- First Name -->
        <div class="form-group">
          <AppInput
            id="firstName"
            v-model="form.formData.firstName"
            label="First Name"
            type="text"
            placeholder="Enter first name"
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
            placeholder="Enter last name"
            :error="form.getFieldError('lastName')"
            @blur="form.touchField('lastName')"
            @input="form.validateField('lastName')"
          />
        </div>
      </div>
    </section>

    <!-- Contact Information Section -->
    <section class="guest-form__section">
      <h3 class="guest-form__section-title">Contact Information</h3>

      <!-- Email -->
      <div class="form-group">
        <AppInput
          id="email"
          v-model="form.formData.email"
          label="Email Address"
          type="email"
          placeholder="guest@example.com"
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

    <!-- Loyalty Program Section -->
    <section class="guest-form__section">
      <h3 class="guest-form__section-title">Loyalty Program</h3>

      <!-- Loyalty Tier -->
      <div class="form-group">
        <label for="loyaltyTier" class="form-label">Loyalty Tier</label>
        <select
          id="loyaltyTier"
          v-model="form.formData.loyaltyTier"
          class="form-control"
          @change="form.validateField('loyaltyTier')"
        >
          <option value="">Select a tier</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>

      <!-- Current Points -->
      <div class="form-group">
        <AppInput
          id="loyaltyBalance"
          v-model.number="form.formData.loyaltyBalance"
          label="Loyalty Points"
          type="number"
          placeholder="0"
          min="0"
          :error="form.getFieldError('loyaltyBalance')"
          @blur="form.touchField('loyaltyBalance')"
          @input="form.validateField('loyaltyBalance')"
        />
      </div>

      <!-- Join Date -->
      <div class="form-group">
        <AppInput
          id="joinDate"
          v-model="form.formData.joinDate"
          label="Join Date"
          type="date"
          :error="form.getFieldError('joinDate')"
          @blur="form.touchField('joinDate')"
          @input="form.validateField('joinDate')"
        />
      </div>
    </section>

    <!-- Preferences Section -->
    <section class="guest-form__section">
      <h3 class="guest-form__section-title">Preferences</h3>

      <!-- Communication Preferences -->
      <div class="form-group guest-form__checkbox-group">
        <label class="guest-form__checkbox">
          <input
            v-model="form.formData.emailOptIn"
            type="checkbox"
            @change="form.validateField('emailOptIn')"
          />
          <span>Opt-in for email communications</span>
        </label>
      </div>

      <div class="form-group guest-form__checkbox-group">
        <label class="guest-form__checkbox">
          <input
            v-model="form.formData.smsOptIn"
            type="checkbox"
            @change="form.validateField('smsOptIn')"
          />
          <span>Opt-in for SMS communications</span>
        </label>
      </div>

      <!-- VIP Status -->
      <div class="form-group guest-form__checkbox-group">
        <label class="guest-form__checkbox">
          <input
            v-model="form.formData.isVip"
            type="checkbox"
            @change="form.validateField('isVip')"
          />
          <span>VIP Status</span>
        </label>
      </div>
    </section>

    <!-- Notes Section -->
    <section class="guest-form__section">
      <h3 class="guest-form__section-title">Additional Information</h3>

      <!-- Notes -->
      <div class="form-group">
        <label for="notes" class="form-label">Notes</label>
        <textarea
          id="notes"
          v-model="form.formData.notes"
          class="form-control guest-form__textarea"
          placeholder="Add any notes about this guest..."
          rows="4"
          @blur="form.touchField('notes')"
          @input="form.validateField('notes')"
        />
      </div>
    </section>

    <!-- Error Alert -->
    <AppAlert
      v-if="form.submitError"
      type="error"
      title="Error"
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
      :message="successMessage"
      closeable
      :model-value="showSuccessMessage"
      @update:model-value="() => (showSuccessMessage = false)"
    />

    <!-- Action Buttons -->
    <div class="guest-form__actions">
      <AppButton
        type="submit"
        variant="primary"
        :loading="form.isSubmitting"
      >
        {{ form.isSubmitting ? 'Saving...' : (isEditMode ? 'Update Guest' : 'Add Guest') }}
      </AppButton>

      <AppButton
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
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
import { useGuest } from '@/presentation/composables/useGuest';
import {
  required,
  email,
  phoneNumber,
  custom,
} from '@/presentation/utils/validators';
import AppInput from '@/presentation/components/common/AppInput.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';
import type { FormConfig } from '@/presentation/composables/useForm';
import type { Guest } from '@/domain/entities';

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  loyaltyTier: string;
  loyaltyBalance: number;
  joinDate: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  isVip: boolean;
  notes: string;
}

interface Props {
  guest?: Guest;
}

const props = withDefaults(defineProps<Props>(), {
  guest: undefined,
});

const emit = defineEmits<{
  cancel: [];
  success: [guest: Guest];
}>();

const { createGuest, updateGuest } = useGuest();
const showSuccessMessage = ref(false);
const successMessage = ref('');

/**
 * Check if in edit mode
 */
const isEditMode = computed(() => !!props.guest);

/**
 * Get default form data
 */
function getDefaultFormData(): GuestFormData {
  if (props.guest) {
    return {
      firstName: props.guest.firstName,
      lastName: props.guest.lastName,
      email: props.guest.email,
      phoneNumber: props.guest.phoneNumber || '',
      loyaltyTier: props.guest.loyaltyTier || '',
      loyaltyBalance: props.guest.loyaltyBalance || 0,
      joinDate: props.guest.joinDate ? new Date(props.guest.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      emailOptIn: props.guest.emailOptIn || false,
      smsOptIn: props.guest.smsOptIn || false,
      isVip: props.guest.isVip || false,
      notes: props.guest.notes || '',
    };
  }

  return {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    loyaltyTier: '',
    loyaltyBalance: 0,
    joinDate: new Date().toISOString().split('T')[0],
    emailOptIn: false,
    smsOptIn: false,
    isVip: false,
    notes: '',
  };
}

/**
 * Form configuration
 */
const guestFormConfig: FormConfig = {
  firstName: {
    validators: [required('First name')],
    defaultValue: getDefaultFormData().firstName,
  },
  lastName: {
    validators: [required('Last name')],
    defaultValue: getDefaultFormData().lastName,
  },
  email: {
    validators: [required('Email'), email()],
    defaultValue: getDefaultFormData().email,
  },
  phoneNumber: {
    validators: [(value: string) => (!value ? null : phoneNumber()(value))],
    defaultValue: getDefaultFormData().phoneNumber,
  },
  loyaltyTier: {
    validators: [required('Loyalty tier')],
    defaultValue: getDefaultFormData().loyaltyTier,
  },
  loyaltyBalance: {
    validators: [
      custom(
        (v) => v >= 0,
        'Loyalty balance must be a positive number'
      ),
    ],
    defaultValue: getDefaultFormData().loyaltyBalance,
  },
  joinDate: {
    validators: [required('Join date')],
    defaultValue: getDefaultFormData().joinDate,
  },
  emailOptIn: {
    validators: [],
    defaultValue: getDefaultFormData().emailOptIn,
  },
  smsOptIn: {
    validators: [],
    defaultValue: getDefaultFormData().smsOptIn,
  },
  isVip: {
    validators: [],
    defaultValue: getDefaultFormData().isVip,
  },
  notes: {
    validators: [],
    defaultValue: getDefaultFormData().notes,
  },
};

/**
 * Handle form submission
 */
async function onSubmit(data: GuestFormData) {
  const guestData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    loyaltyTier: data.loyaltyTier,
    loyaltyBalance: data.loyaltyBalance,
    joinDate: new Date(data.joinDate).toISOString(),
    emailOptIn: data.emailOptIn,
    smsOptIn: data.smsOptIn,
    isVip: data.isVip,
    notes: data.notes,
  };

  let guest: Guest | null = null;

  if (isEditMode.value) {
    guest = await updateGuest(props.guest!.id, guestData);
    successMessage.value = 'Guest updated successfully!';
  } else {
    guest = await createGuest(guestData);
    successMessage.value = 'Guest added successfully!';
  }

  if (guest) {
    showSuccessMessage.value = true;
    emit('success', guest);
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
}

/**
 * Initialize form with computed default values
 */
const form = useForm(guestFormConfig, onSubmit);
</script>

<style scoped>
.guest-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  max-width: 700px;
  padding: var(--space-24);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.guest-form__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.guest-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--color-border);
}

.guest-form__section:last-of-type {
  border-bottom: none;
}

.guest-form__section-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.guest-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
}

@media (max-width: 640px) {
  .guest-form__row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-8);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.guest-form__textarea {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  resize: vertical;
  min-height: 100px;
}

.guest-form__checkbox-group {
  gap: var(--space-8);
}

.guest-form__checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.guest-form__checkbox input {
  margin-top: var(--space-2);
  cursor: pointer;
  accent-color: var(--color-primary);
}

.guest-form__actions {
  display: flex;
  gap: var(--space-16);
  margin-top: var(--space-8);
}

.guest-form__actions .btn {
  flex: 1;
}

@media (max-width: 640px) {
  .guest-form {
    padding: var(--space-16);
  }

  .guest-form__actions {
    flex-direction: column;
  }
}
</style>
