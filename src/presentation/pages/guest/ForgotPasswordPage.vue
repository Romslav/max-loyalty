<template>
  <div class="forgot-password-page">
    <!-- Background decoration -->
    <div class="forgot-password-page__background">
      <div class="forgot-password-page__circle forgot-password-page__circle--1"></div>
      <div class="forgot-password-page__circle forgot-password-page__circle--2"></div>
    </div>

    <!-- Main container -->
    <div class="forgot-password-page__container">
      <!-- Card -->
      <div class="forgot-password-page__card">
        <!-- Header -->
        <div class="forgot-password-page__header">
          <button
            type="button"
            class="forgot-password-page__back-btn"
            @click="handleGoBack"
            aria-label="Volver"
          >
            ←
          </button>
          <div class="forgot-password-page__icon">🔐</div>
        </div>

        <!-- Step 1: Email verification -->
        <template v-if="currentStep === 1">
          <div class="forgot-password-page__content">
            <h1 class="forgot-password-page__title">¿Olvidaste tu contraseña?</h1>
            <p class="forgot-password-page__description">
              Te ayudaremos a recuperar el acceso a tu cuenta. Ingresa tu correo electrónico para comenzar.
            </p>

            <form @submit.prevent="handleVerifyEmail" class="forgot-password-page__form">
              <div class="form-group">
                <label for="email" class="form-label">Correo electrónico</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="tu@email.com"
                  :class="{ 'form-control--error': errors.email }"
                  @blur="validateEmail"
                  required
                />
                <div v-if="errors.email" class="form-error">{{ errors.email }}</div>
              </div>

              <button
                type="submit"
                class="btn btn--primary btn--lg btn--full-width"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Verificar correo</span>
                <span v-else class="forgot-password-page__loader">Buscando...</span>
              </button>
            </form>

            <!-- Info box -->
            <div class="forgot-password-page__info-box">
              <div class="forgot-password-page__info-icon">i</div>
              <p class="forgot-password-page__info-text">
                Revisa tu bandeja de entrada para recibir un enlace de recuperación
              </p>
            </div>
          </div>
        </template>

        <!-- Step 2: Verification code -->
        <template v-if="currentStep === 2">
          <div class="forgot-password-page__content">
            <h1 class="forgot-password-page__title">Verificar código</h1>
            <p class="forgot-password-page__description">
              Hemos enviado un código de 6 dígitos a {{ email }}
            </p>

            <form @submit.prevent="handleVerifyCode" class="forgot-password-page__form">
              <!-- Code input -->
              <div class="form-group">
                <label for="code" class="form-label">Código de verificación</label>
                <div class="forgot-password-page__code-input-wrapper">
                  <input
                    id="code"
                    v-model="code"
                    type="text"
                    class="form-control forgot-password-page__code-input"
                    placeholder="000000"
                    maxlength="6"
                    inputmode="numeric"
                    :class="{ 'form-control--error': errors.code }"
                    @input="handleCodeInput"
                    @blur="validateCode"
                    required
                  />
                  <div v-if="codeTimer > 0" class="forgot-password-page__code-timer">
                    {{ formatTime(codeTimer) }}
                  </div>
                </div>
                <div v-if="errors.code" class="form-error">{{ errors.code }}</div>
              </div>

              <button
                type="submit"
                class="btn btn--primary btn--lg btn--full-width"
                :disabled="isLoading || code.length !== 6"
              >
                <span v-if="!isLoading">Verificar código</span>
                <span v-else class="forgot-password-page__loader">Verificando...</span>
              </button>
            </form>

            <!-- Resend code -->
            <div class="forgot-password-page__resend">
              <span v-if="codeTimer > 0" class="forgot-password-page__resend-text">
                Reenviár código en {{ formatTime(codeTimer) }}
              </span>
              <button
                v-else
                type="button"
                class="forgot-password-page__resend-btn"
                @click="handleResendCode"
                :disabled="isLoading"
              >
                ¿No recibiste el código? Reenviár
              </button>
            </div>
          </div>
        </template>

        <!-- Step 3: Password reset -->
        <template v-if="currentStep === 3">
          <div class="forgot-password-page__content">
            <h1 class="forgot-password-page__title">Establecer nueva contraseña</h1>
            <p class="forgot-password-page__description">
              Crea una contraseña fuerte para proteger tu cuenta
            </p>

            <form @submit.prevent="handleResetPassword" class="forgot-password-page__form">
              <!-- New password -->
              <div class="form-group">
                <label for="password" class="form-label">Nueva contraseña</label>
                <div class="forgot-password-page__password-wrapper">
                  <input
                    id="password"
                    v-model="newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="••••••••"
                    :class="{ 'form-control--error': errors.password }"
                    @blur="validatePassword"
                    @input="updatePasswordStrength"
                    required
                  />
                  <button
                    type="button"
                    class="forgot-password-page__password-toggle"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <div v-if="errors.password" class="form-error">{{ errors.password }}</div>

                <!-- Password strength -->
                <div v-if="newPassword" class="forgot-password-page__password-strength">
                  <div class="forgot-password-page__strength-bar">
                    <div
                      class="forgot-password-page__strength-fill"
                      :class="`forgot-password-page__strength-fill--${passwordStrength}`"
                      :style="{ width: passwordStrengthPercent + '%' }"
                    ></div>
                  </div>
                  <div class="forgot-password-page__strength-text" :class="`forgot-password-page__strength-text--${passwordStrength}`">
                    Contraseña {{ passwordStrengthLabel }}
                  </div>
                </div>
              </div>

              <!-- Confirm password -->
              <div class="form-group">
                <label for="confirm-password" class="form-label">Confirmar contraseña</label>
                <div class="forgot-password-page__password-wrapper">
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="••••••••"
                    :class="{ 'form-control--error': errors.confirmPassword }"
                    @blur="validateConfirmPassword"
                    required
                  />
                  <button
                    type="button"
                    class="forgot-password-page__password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    {{ showConfirmPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
                <div v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</div>
              </div>

              <!-- Requirements -->
              <div class="forgot-password-page__requirements">
                <div class="forgot-password-page__requirement" :class="{ 'forgot-password-page__requirement--met': passwordRequirements.length }">
                  {{ passwordRequirements.length ? '✓' : '✗' }} Al menos 8 caracteres
                </div>
                <div class="forgot-password-page__requirement" :class="{ 'forgot-password-page__requirement--met': passwordRequirements.uppercase }">
                  {{ passwordRequirements.uppercase ? '✓' : '✗' }} Una mayúscula
                </div>
                <div class="forgot-password-page__requirement" :class="{ 'forgot-password-page__requirement--met': passwordRequirements.number }">
                  {{ passwordRequirements.number ? '✓' : '✗' }} Un número
                </div>
                <div class="forgot-password-page__requirement" :class="{ 'forgot-password-page__requirement--met': passwordRequirements.special }">
                  {{ passwordRequirements.special ? '✓' : '✗' }} Un carácter especial
                </div>
              </div>

              <button
                type="submit"
                class="btn btn--primary btn--lg btn--full-width"
                :disabled="isLoading || !isPasswordFormValid"
              >
                <span v-if="!isLoading">Guardar nueva contraseña</span>
                <span v-else class="forgot-password-page__loader">Guardando...</span>
              </button>
            </form>
          </div>
        </template>

        <!-- Step 4: Success -->
        <template v-if="currentStep === 4">
          <div class="forgot-password-page__content forgot-password-page__content--success">
            <div class="forgot-password-page__success-icon">✅</div>
            <h1 class="forgot-password-page__title">Contraseña actualizada</h1>
            <p class="forgot-password-page__description">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <router-link to="/login" class="btn btn--primary btn--lg btn--full-width">
              Ir al inicio de sesión
            </router-link>
          </div>
        </template>
      </div>

      <!-- Progress steps -->
      <div class="forgot-password-page__steps">
        <div
          v-for="(step, index) in 4"
          :key="index"
          class="forgot-password-page__step"
          :class="{ 'forgot-password-page__step--active': index < currentStep }"
        >
          {{ step }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// State
const currentStep = ref(1);
const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const codeTimer = ref(0);
const passwordStrength = ref<'weak' | 'fair' | 'good' | 'strong'>('weak');

const errors = ref<Record<string, string>>({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
});

let timerInterval: ReturnType<typeof setInterval> | null = null;

// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Computed properties
const passwordRequirements = computed(() => ({
  length: newPassword.value.length >= 8,
  uppercase: /[A-Z]/.test(newPassword.value),
  number: /[0-9]/.test(newPassword.value),
  special: /[!@#$%^&*()\-_+=\[\]{};:'"<>,.?/\\|`~]/.test(newPassword.value),
}));

const isPasswordFormValid = computed(() => {
  return (
    Object.values(passwordRequirements.value).every((v) => v) &&
    confirmPassword.value === newPassword.value &&
    !errors.value.password &&
    !errors.value.confirmPassword
  );
});

const passwordStrengthPercent = computed(() => {
  const strength = { weak: 25, fair: 50, good: 75, strong: 100 };
  return strength[passwordStrength.value];
});

const passwordStrengthLabel = computed(() => {
  const labels = { weak: 'débil', fair: 'aceptable', good: 'fuerte', strong: 'muy fuerte' };
  return labels[passwordStrength.value];
});

// Format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Validation methods
const validateEmail = () => {
  const trimmedEmail = email.value.trim();
  
  if (!trimmedEmail) {
    errors.value.email = 'El correo es requerido';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.value.email = 'Ingresa un correo válido';
  } else {
    errors.value.email = '';
  }
};

const validateCode = () => {
  if (!code.value) {
    errors.value.code = 'El código es requerido';
  } else if (code.value.length !== 6) {
    errors.value.code = 'El código debe tener 6 dígitos';
  } else if (!/^\d+$/.test(code.value)) {
    errors.value.code = 'El código debe contener solo números';
  } else {
    errors.value.code = '';
  }
};

const validatePassword = () => {
  const password = newPassword.value;
  
  if (!password) {
    errors.value.password = 'La contraseña es requerida';
  } else if (password.length < 8) {
    errors.value.password = 'Debe tener al menos 8 caracteres';
  } else if (!/[A-Z]/.test(password)) {
    errors.value.password = 'Debe incluir una mayúscula';
  } else if (!/[0-9]/.test(password)) {
    errors.value.password = 'Debe incluir un número';
  } else if (!/[!@#$%^&*()\-_+=\[\]{};:'"<>,.?/\\|`~]/.test(password)) {
    errors.value.password = 'Debe incluir un carácter especial';
  } else {
    errors.value.password = '';
  }
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Confirma tu contraseña';
  } else if (confirmPassword.value !== newPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
  } else {
    errors.value.confirmPassword = '';
  }
};

const handleCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
  code.value = input.value;
};

const updatePasswordStrength = () => {
  const password = newPassword.value;
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()\-_+=\[\]{};:'"<>,.?/\\|`~]/.test(password)) strength++;

  const levels = ['weak', 'fair', 'good', 'strong'] as const;
  passwordStrength.value = levels[Math.min(strength - 1, 3)];
};

// Handlers
const handleVerifyEmail = async () => {
  validateEmail();
  if (errors.value.email) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    currentStep.value = 2;
    startCodeTimer();
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyCode = async () => {
  validateCode();
  if (errors.value.code) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    currentStep.value = 3;
    if (timerInterval) clearInterval(timerInterval);
  } finally {
    isLoading.value = false;
  }
};

const handleResendCode = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    code.value = '';
    startCodeTimer();
  } finally {
    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  validatePassword();
  validateConfirmPassword();
  if (!isPasswordFormValid.value) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    currentStep.value = 4;
  } finally {
    isLoading.value = false;
  }
};

const handleGoBack = () => {
  if (currentStep.value === 1) {
    // Go back to login
    window.history.back();
  } else if (currentStep.value === 2) {
    currentStep.value = 1;
    code.value = '';
    if (timerInterval) clearInterval(timerInterval);
  } else if (currentStep.value === 3) {
    currentStep.value = 2;
    startCodeTimer();
  }
};

const startCodeTimer = () => {
  codeTimer.value = 300; // 5 minutes
  
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    codeTimer.value--;
    if (codeTimer.value <= 0) {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

// Lifecycle
onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
:root {
  --forgot-bg-primary: var(--color-cream-50);
  --forgot-bg-secondary: var(--color-cream-100);
  --forgot-text-primary: var(--color-slate-900);
  --forgot-text-secondary: var(--color-slate-500);
  --forgot-accent: var(--color-teal-500);
  --forgot-accent-hover: var(--color-teal-600);
  --forgot-border: rgba(94, 82, 64, 0.12);
  --forgot-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --forgot-bg-primary: var(--color-charcoal-700);
    --forgot-bg-secondary: var(--color-charcoal-800);
    --forgot-text-primary: var(--color-gray-200);
    --forgot-text-secondary: rgba(167, 169, 169, 0.7);
    --forgot-accent: var(--color-teal-300);
    --forgot-accent-hover: var(--color-teal-400);
    --forgot-border: rgba(119, 124, 124, 0.2);
    --forgot-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.forgot-password-page {
  position: relative;
  min-height: 100vh;
  background: var(--forgot-bg-primary);
  color: var(--forgot-text-primary);
  overflow: hidden;
  font-family: var(--font-family-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-32);
}

/* Background decoration */
.forgot-password-page__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.forgot-password-page__circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.forgot-password-page__circle--1 {
  width: 400px;
  height: 400px;
  background: var(--forgot-accent);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.forgot-password-page__circle--2 {
  width: 300px;
  height: 300px;
  background: var(--color-orange-500);
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

/* Main container */
.forgot-password-page__container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Card */
.forgot-password-page__card {
  background: var(--forgot-bg-secondary);
  border: 1px solid var(--forgot-border);
  border-radius: var(--radius-lg);
  padding: var(--space-32);
  box-shadow: var(--forgot-shadow);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header -->
.forgot-password-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-24);
}

.forgot-password-page__back-btn {
  background: none;
  border: none;
  color: var(--forgot-text-secondary);
  font-size: var(--font-size-xl);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--duration-fast) var(--ease-standard);
  padding: var(--space-4);
}

.forgot-password-page__back-btn:hover {
  opacity: 1;
}

.forgot-password-page__icon {
  font-size: var(--font-size-3xl);
}

/* Content */
.forgot-password-page__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.forgot-password-page__content--success {
  text-align: center;
}

.forgot-password-page__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.forgot-password-page__description {
  font-size: var(--font-size-base);
  color: var(--forgot-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.forgot-password-page__success-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--space-16);
}

/* Form */
.forgot-password-page__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--forgot-text-primary);
}

.form-control {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  font-size: var(--font-size-base);
  border: 1px solid var(--forgot-border);
  border-radius: var(--radius-base);
  background: var(--forgot-bg-primary);
  color: var(--forgot-text-primary);
  transition: all var(--duration-fast) var(--ease-standard);
  font-family: var(--font-family-base);
}

.form-control:focus {
  outline: none;
  border-color: var(--forgot-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-teal-500-rgb), 0.1);
}

.form-control--error {
  border-color: var(--color-error);
}

.form-control--error:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: -6px;
}

/* Code input */
.forgot-password-page__code-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.forgot-password-page__code-input {
  font-size: var(--font-size-lg);
  letter-spacing: var(--space-8);
  text-align: center;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-mono);
}

.forgot-password-page__code-timer {
  position: absolute;
  right: var(--space-16);
  font-size: var(--font-size-sm);
  color: var(--forgot-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Password wrapper */
.forgot-password-page__password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.forgot-password-page__password-toggle {
  position: absolute;
  right: var(--space-12);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  opacity: 0.6;
  transition: opacity var(--duration-fast) var(--ease-standard);
  padding: var(--space-8);
}

.forgot-password-page__password-toggle:hover {
  opacity: 1;
}

/* Password strength */
.forgot-password-page__password-strength {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-8);
}

.forgot-password-page__strength-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.forgot-password-page__strength-fill {
  height: 100%;
  transition: all var(--duration-normal) var(--ease-standard);
}

.forgot-password-page__strength-fill--weak {
  background: var(--color-error);
}

.forgot-password-page__strength-fill--fair {
  background: var(--color-warning);
}

.forgot-password-page__strength-fill--good {
  background: var(--color-info);
}

.forgot-password-page__strength-fill--strong {
  background: var(--color-success);
}

.forgot-password-page__strength-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.forgot-password-page__strength-text--weak {
  color: var(--color-error);
}

.forgot-password-page__strength-text--fair {
  color: var(--color-warning);
}

.forgot-password-page__strength-text--good {
  color: var(--color-info);
}

.forgot-password-page__strength-text--strong {
  color: var(--color-success);
}

/* Requirements */
.forgot-password-page__requirements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-16);
  background: rgba(var(--color-teal-500-rgb), 0.05);
  border: 1px solid var(--forgot-border);
  border-radius: var(--radius-base);
}

.forgot-password-page__requirement {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.forgot-password-page__requirement--met {
  color: var(--color-success);
}

/* Resend -->
.forgot-password-page__resend {
  text-align: center;
}

.forgot-password-page__resend-text {
  font-size: var(--font-size-sm);
  color: var(--forgot-text-secondary);
}

.forgot-password-page__resend-btn {
  font-size: var(--font-size-sm);
  color: var(--forgot-accent);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: color var(--duration-fast) var(--ease-standard);
}

.forgot-password-page__resend-btn:hover {
  color: var(--forgot-accent-hover);
}

.forgot-password-page__resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading state */
.forgot-password-page__loader {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Info box */
.forgot-password-page__info-box {
  display: flex;
  gap: var(--space-12);
  padding: var(--space-16);
  background: rgba(var(--color-info-rgb), 0.1);
  border: 1px solid rgba(var(--color-info-rgb), 0.2);
  border-radius: var(--radius-base);
}

.forgot-password-page__info-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-info);
  color: white;
  border-radius: 50%;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.forgot-password-page__info-text {
  font-size: var(--font-size-sm);
  color: var(--forgot-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Steps */
.forgot-password-page__steps {
  display: flex;
  justify-content: center;
  gap: var(--space-16);
  margin-top: var(--space-32);
}

.forgot-password-page__step {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--forgot-border);
  color: var(--forgot-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-normal) var(--ease-standard);
}

.forgot-password-page__step--active {
  background: var(--forgot-accent);
  color: white;
}

/* Responsive design */
@media (max-width: 640px) {
  .forgot-password-page {
    padding: var(--space-16);
  }

  .forgot-password-page__card {
    padding: var(--space-20);
  }

  .forgot-password-page__title {
    font-size: var(--font-size-xl);
  }

  .forgot-password-page__requirements {
    grid-template-columns: 1fr;
  }

  .forgot-password-page__steps {
    flex-wrap: wrap;
    gap: var(--space-12);
  }

  .forgot-password-page__step {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-xs);
  }
}
</style>
