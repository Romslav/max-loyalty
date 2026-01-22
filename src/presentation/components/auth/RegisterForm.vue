<template>
  <form @submit.prevent="form.handleSubmit" class="register-form">
    <h2 class="register-form__title">Create Account</h2>

    <!-- Name Field -->
    <div class="form-group">
      <AppInput
        id="name"
        v-model="form.formData.name"
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        :error="form.getFieldError('name')"
        @blur="form.touchField('name')"
        @input="form.validateField('name')"
      />
    </div>

    <!-- Email Field -->
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

    <!-- Password Field -->
    <div class="form-group">
      <AppInput
        id="password"
        v-model="form.formData.password"
        label="Password"
        type="password"
        placeholder="Create a strong password"
        :error="form.getFieldError('password')"
        @blur="form.touchField('password')"
        @input="form.validateField('password')"
      />
      <div v-if="form.touched.password" class="register-form__hint">
        <p>Password must contain:</p>
        <ul>
          <li :class="{ 'met': hasUppercase }">At least one uppercase letter</li>
          <li :class="{ 'met': hasLowercase }">At least one lowercase letter</li>
          <li :class="{ 'met': hasNumber }">At least one number</li>
          <li :class="{ 'met': hasMinLength }">At least 8 characters</li>
        </ul>
      </div>
    </div>

    <!-- Confirm Password Field -->
    <div class="form-group">
      <AppInput
        id="confirmPassword"
        v-model="form.formData.confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        :error="form.getFieldError('confirmPassword')"
        @blur="form.touchField('confirmPassword')"
        @input="form.validateField('confirmPassword')"
      />
    </div>

    <!-- Terms Checkbox -->
    <div class="form-group register-form__terms">
      <label class="register-form__checkbox">
        <input
          v-model="form.formData.agreedToTerms"
          type="checkbox"
          @change="form.validateField('agreedToTerms')"
        />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>
      <p v-if="form.getFieldError('agreedToTerms')" class="register-form__error">
        {{ form.getFieldError('agreedToTerms') }}
      </p>
    </div>

    <!-- Error Alert -->
    <AppAlert
      v-if="form.submitError"
      type="error"
      title="Registration Error"
      :message="form.submitError"
      closeable
      :model-value="!!form.submitError"
      @update:model-value="() => (form.submitError = null)"
    />

    <!-- Submit Button -->
    <AppButton
      type="submit"
      variant="primary"
      class="register-form__submit"
      :loading="form.isSubmitting"
      :disabled="!form.isValid && form.isDirty"
    >
      {{ form.isSubmitting ? 'Creating Account...' : 'Create Account' }}
    </AppButton>

    <!-- Sign In Link -->
    <div class="register-form__footer">
      <p>
        Already have an account?
        <router-link to="/auth/login" class="register-form__link">Sign in</router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from '@/presentation/composables/useForm';
import { useAuth } from '@/presentation/composables/useAuth';
import {
  required,
  email,
  passwordStrength,
  matchField,
  custom,
} from '@/presentation/utils/validators';
import AppInput from '@/presentation/components/common/AppInput.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';
import type { FormConfig } from '@/presentation/composables/useForm';

const router = useRouter();
const { register } = useAuth();

/**
 * Password strength indicators
 */
const password = computed(() => form.formData.password);
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasNumber = computed(() => /[0-9]/.test(password.value));
const hasMinLength = computed(() => password.value.length >= 8);

/**
 * Form configuration
 */
const registerFormConfig: FormConfig = {
  name: {
    validators: [required('Full name')],
    defaultValue: '',
  },
  email: {
    validators: [required('Email'), email()],
    defaultValue: '',
  },
  password: {
    validators: [required('Password'), passwordStrength()],
    defaultValue: '',
  },
  confirmPassword: {
    validators: [
      required('Please confirm your password'),
      (value: string) => matchField(form.formData.password)(value),
    ],
    defaultValue: '',
  },
  agreedToTerms: {
    validators: [
      (value: boolean) => {
        if (!value) {
          return 'You must agree to the terms';
        }
        return null;
      },
    ],
    defaultValue: false,
  },
};

/**
 * Handle form submission
 */
async function onSubmit(data: any) {
  const { confirmPassword, agreedToTerms, ...registerData } = data;
  const success = await register(registerData);

  if (success) {
    // Redirect to dashboard
    await router.push('/dashboard');
  }
}

/**
 * Initialize form
 */
const form = useForm(registerFormConfig, onSubmit);
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  max-width: 450px;
  margin: 0 auto;
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.register-form__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.register-form__hint {
  padding: var(--space-8) var(--space-12);
  background: rgba(var(--color-info-rgb), 0.1);
  border-left: 3px solid var(--color-info);
  border-radius: var(--radius-sm);
}

.register-form__hint p {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.register-form__hint ul {
  margin: 0;
  padding-left: var(--space-16);
  list-style: none;
}

.register-form__hint li {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.register-form__hint li.met {
  color: var(--color-success);
}

.register-form__hint li.met::before {
  content: '\2713 ';
  margin-right: var(--space-4);
}

.register-form__terms {
  gap: var(--space-4);
}

.register-form__checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.register-form__checkbox input {
  margin-top: var(--space-2);
  cursor: pointer;
}

.register-form__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.register-form__submit {
  width: 100%;
}

.register-form__footer {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.register-form__footer p {
  margin: 0;
}

.register-form__link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--duration-fast) var(--ease-standard);
}

.register-form__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
