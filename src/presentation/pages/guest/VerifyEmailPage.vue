<template>
  <div class="verify-email-page">
    <!-- Background decoration -->
    <div class="verify-email-page__background">
      <div class="verify-email-page__circle verify-email-page__circle--1"></div>
      <div class="verify-email-page__circle verify-email-page__circle--2"></div>
    </div>

    <!-- Main container -->
    <div class="verify-email-page__container">
      <!-- Card -->
      <div class="verify-email-page__card">
        <!-- Step 1: Pending verification -->
        <template v-if="currentStep === 1">
          <div class="verify-email-page__content">
            <div class="verify-email-page__icon">✉️</div>
            <h1 class="verify-email-page__title">Verifica tu correo</h1>
            <p class="verify-email-page__description">
              Hemos enviado un enlace de verificación a:
            </p>
            <p class="verify-email-page__email">{{ userEmail }}</p>

            <!-- Code input -->
            <form @submit.prevent="handleVerifyEmail" class="verify-email-page__form">
              <div class="form-group">
                <label for="code" class="form-label">Código de verificación (6 dígitos)</label>
                <div class="verify-email-page__code-input-wrapper">
                  <input
                    id="code"
                    v-model="code"
                    type="text"
                    class="form-control verify-email-page__code-input"
                    placeholder="000000"
                    maxlength="6"
                    inputmode="numeric"
                    :class="{ 'form-control--error': errors.code }"
                    @input="handleCodeInput"
                    @blur="validateCode"
                    required
                  />
                  <div v-if="codeTimer > 0" class="verify-email-page__code-timer">
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
                <span v-if="!isLoading">Verificar correo</span>
                <span v-else class="verify-email-page__loader">Verificando...</span>
              </button>
            </form>

            <!-- Options -->
            <div class="verify-email-page__options">
              <div class="verify-email-page__option-divider">o</div>

              <button
                type="button"
                class="verify-email-page__option-btn"
                @click="handleVerifyWithLink"
                :disabled="isLoading"
              >
                Abre el enlace de verificación en tu correo
              </button>
            </div>

            <!-- Resend code -->
            <div class="verify-email-page__resend">
              <span v-if="codeTimer > 0" class="verify-email-page__resend-text">
                Reenviá código en {{ formatTime(codeTimer) }}
              </span>
              <button
                v-else
                type="button"
                class="verify-email-page__resend-btn"
                @click="handleResendCode"
                :disabled="isLoading"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>

            <!-- Info -->
            <div class="verify-email-page__info">
              <div class="verify-email-page__info-icon">ℹ️</div>
              <p class="verify-email-page__info-text">
                Revisa tu carpeta de spam o promociones si no ves el correo
              </p>
            </div>

            <!-- Change email -->
            <button
              type="button"
              class="verify-email-page__change-email-btn"
              @click="currentStep = 2"
            >
              Usar otro correo electrónico
            </button>
          </div>
        </template>

        <!-- Step 2: Change email -->
        <template v-if="currentStep === 2">
          <div class="verify-email-page__content">
            <div class="verify-email-page__icon">📧</div>
            <h1 class="verify-email-page__title">Cambiar correo electrónico</h1>
            <p class="verify-email-page__description">
              Ingresa un nuevo correo para continuar
            </p>

            <form @submit.prevent="handleChangeEmail" class="verify-email-page__form">
              <div class="form-group">
                <label for="new-email" class="form-label">Nuevo correo electrónico</label>
                <input
                  id="new-email"
                  v-model="newEmail"
                  type="email"
                  class="form-control"
                  placeholder="tu@email.com"
                  :class="{ 'form-control--error': errors.email }"
                  @blur="validateNewEmail"
                  required
                />
                <div v-if="errors.email" class="form-error">{{ errors.email }}</div>
              </div>

              <button
                type="submit"
                class="btn btn--primary btn--lg btn--full-width"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Continuar</span>
                <span v-else class="verify-email-page__loader">Procesando...</span>
              </button>

              <button
                type="button"
                class="btn btn--secondary btn--lg btn--full-width"
                @click="currentStep = 1"
              >
                Volver
              </button>
            </form>
          </div>
        </template>

        <!-- Step 3: Success -->
        <template v-if="currentStep === 3">
          <div class="verify-email-page__content verify-email-page__content--success">
            <div class="verify-email-page__success-icon">✅</div>
            <h1 class="verify-email-page__title">¡Verificación completada!</h1>
            <p class="verify-email-page__description">
              Tu correo ha sido verificado exitosamente. Ya puedes disfrutar de todos los beneficios del programa.
            </p>

            <div class="verify-email-page__benefits">
              <div class="verify-email-page__benefit">
                <div class="verify-email-page__benefit-icon">🎉</div>
                <div class="verify-email-page__benefit-text">200 puntos de bienvenida</div>
              </div>
              <div class="verify-email-page__benefit">
                <div class="verify-email-page__benefit-icon">🏆</div>
                <div class="verify-email-page__benefit-text">Nivel Bronze activado</div>
              </div>
              <div class="verify-email-page__benefit">
                <div class="verify-email-page__benefit-icon">🎁</div>
                <div class="verify-email-page__benefit-text">Ofertas exclusivas disponibles</div>
              </div>
            </div>

            <router-link to="/dashboard" class="btn btn--primary btn--lg btn--full-width">
              Ir al dashboard
            </router-link>

            <button
              type="button"
              class="btn btn--secondary btn--lg btn--full-width"
              @click="handleViewProfile"
            >
              Ver mi perfil
            </button>
          </div>
        </template>
      </div>

      <!-- Progress indicator -->
      <div class="verify-email-page__progress">
        <div class="verify-email-page__progress-text">
          Paso {{ currentStep }} de 3
        </div>
        <div class="verify-email-page__progress-bar">
          <div
            class="verify-email-page__progress-fill"
            :style="{ width: (currentStep / 3) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// State
const currentStep = ref(1);
const userEmail = ref('');
const code = ref('');
const newEmail = ref('');
const isLoading = ref(false);
const codeTimer = ref(300); // 5 minutes

const errors = ref<Record<string, string>>({
  code: '',
  email: '',
});

let timerInterval: ReturnType<typeof setInterval> | null = null;

// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Validation methods
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

const validateNewEmail = () => {
  const trimmedEmail = newEmail.value.trim();
  
  if (!trimmedEmail) {
    errors.value.email = 'El correo es requerido';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.value.email = 'Ingresa un correo válido';
  } else if (trimmedEmail === userEmail.value) {
    errors.value.email = 'Usa un correo diferente al actual';
  } else {
    errors.value.email = '';
  }
};

// Input handlers
const handleCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
  code.value = input.value;
};

// Form handlers
const handleVerifyEmail = async () => {
  validateCode();
  if (errors.value.code) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    currentStep.value = 3;
    if (timerInterval) clearInterval(timerInterval);
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyWithLink = async () => {
  isLoading.value = true;

  try {
    // Simulate opening email link
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
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

const handleChangeEmail = async () => {
  validateNewEmail();
  if (errors.value.email) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    userEmail.value = newEmail.value;
    newEmail.value = '';
    code.value = '';
    currentStep.value = 1;
    startCodeTimer();
  } finally {
    isLoading.value = false;
  }
};

const handleViewProfile = () => {
  // In real app: router.push('/profile')
  window.location.href = '/profile';
};

// Timer
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
onMounted(() => {
  // Get user email from session
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    userEmail.value = user.email || 'tu@email.com';
  } else {
    userEmail.value = 'tu@email.com';
  }

  startCodeTimer();
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
:root {
  --verify-bg-primary: var(--color-cream-50);
  --verify-bg-secondary: var(--color-cream-100);
  --verify-text-primary: var(--color-slate-900);
  --verify-text-secondary: var(--color-slate-500);
  --verify-accent: var(--color-teal-500);
  --verify-accent-hover: var(--color-teal-600);
  --verify-border: rgba(94, 82, 64, 0.12);
  --verify-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --verify-bg-primary: var(--color-charcoal-700);
    --verify-bg-secondary: var(--color-charcoal-800);
    --verify-text-primary: var(--color-gray-200);
    --verify-text-secondary: rgba(167, 169, 169, 0.7);
    --verify-accent: var(--color-teal-300);
    --verify-accent-hover: var(--color-teal-400);
    --verify-border: rgba(119, 124, 124, 0.2);
    --verify-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.verify-email-page {
  position: relative;
  min-height: 100vh;
  background: var(--verify-bg-primary);
  color: var(--verify-text-primary);
  overflow: hidden;
  font-family: var(--font-family-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-32);
}

/* Background decoration */
.verify-email-page__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.verify-email-page__circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.verify-email-page__circle--1 {
  width: 400px;
  height: 400px;
  background: var(--verify-accent);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.verify-email-page__circle--2 {
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

/* Container */
.verify-email-page__container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Card */
.verify-email-page__card {
  background: var(--verify-bg-secondary);
  border: 1px solid var(--verify-border);
  border-radius: var(--radius-lg);
  padding: var(--space-32);
  box-shadow: var(--verify-shadow);
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

/* Content */
.verify-email-page__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  text-align: center;
}

.verify-email-page__content--success {
  gap: var(--space-16);
}

.verify-email-page__icon {
  font-size: var(--font-size-4xl);
}

.verify-email-page__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.verify-email-page__description {
  font-size: var(--font-size-base);
  color: var(--verify-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.verify-email-page__email {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--verify-accent);
  margin: 0;
  word-break: break-all;
}

.verify-email-page__success-icon {
  font-size: var(--font-size-5xl);
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Form */
.verify-email-page__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--verify-text-primary);
}

.form-control {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  font-size: var(--font-size-base);
  border: 1px solid var(--verify-border);
  border-radius: var(--radius-base);
  background: var(--verify-bg-primary);
  color: var(--verify-text-primary);
  transition: all var(--duration-fast) var(--ease-standard);
  font-family: var(--font-family-base);
}

.form-control:focus {
  outline: none;
  border-color: var(--verify-accent);
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
  text-align: left;
}

/* Code input */
.verify-email-page__code-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.verify-email-page__code-input {
  font-size: var(--font-size-lg);
  letter-spacing: var(--space-8);
  text-align: center;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-mono);
}

.verify-email-page__code-timer {
  position: absolute;
  right: var(--space-16);
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Options */
.verify-email-page__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
}

.verify-email-page__option-divider {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
  font-weight: var(--font-weight-medium);
}

.verify-email-page__option-btn {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  font-size: var(--font-size-sm);
  color: var(--verify-accent);
  background: rgba(var(--color-teal-500-rgb), 0.1);
  border: 1px solid var(--verify-accent);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-standard);
}

.verify-email-page__option-btn:hover {
  background: rgba(var(--color-teal-500-rgb), 0.2);
  transform: translateY(-2px);
}

.verify-email-page__option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Resend */
.verify-email-page__resend {
  text-align: center;
}

.verify-email-page__resend-text {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
}

.verify-email-page__resend-btn {
  font-size: var(--font-size-sm);
  color: var(--verify-accent);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: color var(--duration-fast) var(--ease-standard);
}

.verify-email-page__resend-btn:hover {
  color: var(--verify-accent-hover);
}

.verify-email-page__resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info */
.verify-email-page__info {
  display: flex;
  gap: var(--space-12);
  align-items: flex-start;
  padding: var(--space-16);
  background: rgba(var(--color-info-rgb), 0.1);
  border: 1px solid rgba(var(--color-info-rgb), 0.2);
  border-radius: var(--radius-base);
  text-align: left;
}

.verify-email-page__info-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.verify-email-page__info-text {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Change email button */
.verify-email-page__change-email-btn {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: color var(--duration-fast) var(--ease-standard);
}

.verify-email-page__change-email-btn:hover {
  color: var(--verify-text-primary);
}

/* Benefits -->
.verify-email-page__benefits {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin: var(--space-16) 0;
}

.verify-email-page__benefit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  padding: var(--space-12);
  background: rgba(var(--color-teal-500-rgb), 0.05);
  border-radius: var(--radius-base);
}

.verify-email-page__benefit-icon {
  font-size: var(--font-size-xl);
}

.verify-email-page__benefit-text {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
}

/* Progress */
.verify-email-page__progress {
  margin-top: var(--space-32);
}

.verify-email-page__progress-text {
  font-size: var(--font-size-sm);
  color: var(--verify-text-secondary);
  text-align: center;
  margin-bottom: var(--space-12);
}

.verify-email-page__progress-bar {
  height: 4px;
  background: var(--verify-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.verify-email-page__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--verify-accent) 0%, var(--color-teal-600) 100%);
  transition: width 0.3s ease-out;
}

/* Loading state */
.verify-email-page__loader {
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

/* Responsive design */
@media (max-width: 640px) {
  .verify-email-page {
    padding: var(--space-16);
  }

  .verify-email-page__card {
    padding: var(--space-20);
  }

  .verify-email-page__title {
    font-size: var(--font-size-xl);
  }

  .verify-email-page__icon,
  .verify-email-page__success-icon {
    font-size: var(--font-size-3xl);
  }
}
</style>
