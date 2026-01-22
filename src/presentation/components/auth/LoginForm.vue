<template>
  <form @submit.prevent="form.handleSubmit" class="login-form">
    <h2 class="login-form__title">Sign In</h2>

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
        placeholder="Enter your password"
        :error="form.getFieldError('password')"
        @blur="form.touchField('password')"
        @input="form.validateField('password')"
      />
    </div>

    <!-- Error Alert -->
    <AppAlert
      v-if="form.submitError"
      type="error"
      title="Login Error"
      :message="form.submitError"
      closeable
      :model-value="!!form.submitError"
      @update:model-value="() => (form.submitError = null)"
    />

    <!-- Submit Button -->
    <AppButton
      type="submit"
      variant="primary"
      class="login-form__submit"
      :loading="form.isSubmitting"
      :disabled="!form.isValid && form.isDirty"
    >
      {{ form.isSubmitting ? 'Signing In...' : 'Sign In' }}
    </AppButton>

    <!-- Sign Up Link -->
    <div class="login-form__footer">
      <p>
        Don't have an account?
        <router-link to="/auth/register" class="login-form__link">Sign up</router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useForm } from '@/presentation/composables/useForm';
import { useAuth } from '@/presentation/composables/useAuth';
import { required, email, minLength } from '@/presentation/utils/validators';
import AppInput from '@/presentation/components/common/AppInput.vue';
import AppButton from '@/presentation/components/common/AppButton.vue';
import AppAlert from '@/presentation/components/common/AppAlert.vue';
import type { FormConfig } from '@/presentation/composables/useForm';

const router = useRouter();
const { login } = useAuth();

/**
 * Form configuration
 */
const loginFormConfig: FormConfig = {
  email: {
    validators: [required('Email'), email()],
    defaultValue: '',
  },
  password: {
    validators: [required('Password'), minLength(6)],
    defaultValue: '',
  },
};

/**
 * Handle form submission
 */
async function onSubmit(data: { email: string; password: string }) {
  const success = await login(data);

  if (success) {
    // Redirect to dashboard
    await router.push('/dashboard');
  }
}

/**
 * Initialize form
 */
const form = useForm(loginFormConfig, onSubmit);
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.login-form__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.login-form__submit {
  width: 100%;
}

.login-form__footer {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.login-form__footer p {
  margin: 0;
}

.login-form__link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--duration-fast) var(--ease-standard);
}

.login-form__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
