<template>
  <div class="login-page">
    <!-- Background decoration -->
    <div class="login-page__background">
      <div class="login-page__circle login-page__circle--1"></div>
      <div class="login-page__circle login-page__circle--2"></div>
      <div class="login-page__circle login-page__circle--3"></div>
    </div>

    <!-- Main container -->
    <div class="login-page__container">
      <!-- Left section - Branding -->
      <div class="login-page__branding">
        <div class="login-page__logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
            <path d="M32 12V52M12 32H52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="login-page__title">MAX Loyalty</h1>
        <p class="login-page__subtitle">Programa de fidelización premium</p>
        
        <div class="login-page__features">
          <div class="login-page__feature">
            <div class="login-page__feature-icon">✨</div>
            <div class="login-page__feature-text">Gana puntos en cada compra</div>
          </div>
          <div class="login-page__feature">
            <div class="login-page__feature-icon">🎁</div>
            <div class="login-page__feature-text">Acceso exclusivo a ofertas</div>
          </div>
          <div class="login-page__feature">
            <div class="login-page__feature-icon">🏆</div>
            <div class="login-page__feature-text">Alcanza niveles premium</div>
          </div>
        </div>
      </div>

      <!-- Right section - Login form -->
      <div class="login-page__form-section">
        <div class="login-page__form-wrapper">
          <h2 class="login-page__form-title">Iniciar sesión</h2>
          <p class="login-page__form-subtitle">Bienvenido de vuelta</p>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="login-page__form">
            <!-- Email field -->
            <div class="form-group">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-control"
                placeholder="tu@email.com"
                :class="{ 'form-control--error': errors.email }"
                @blur="validateEmail"
                required
              />
              <div v-if="errors.email" class="form-error">{{ errors.email }}</div>
            </div>

            <!-- Password field -->
            <div class="form-group">
              <div class="form-label-row">
                <label for="password" class="form-label">Contraseña</label>
                <router-link to="/forgot-password" class="login-page__forgot-link">
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>
              <div class="login-page__password-wrapper">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="••••••••"
                  :class="{ 'form-control--error': errors.password }"
                  @blur="validatePassword"
                  required
                />
                <button
                  type="button"
                  class="login-page__password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div v-if="errors.password" class="form-error">{{ errors.password }}</div>
            </div>

            <!-- Remember me checkbox -->
            <div class="login-page__checkbox-group">
              <input
                id="remember"
                v-model="formData.rememberMe"
                type="checkbox"
                class="login-page__checkbox"
              />
              <label for="remember" class="login-page__checkbox-label">
                Recuérdame en este dispositivo
              </label>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              class="btn btn--primary btn--lg btn--full-width"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="!isLoading">Iniciar sesión</span>
              <span v-else class="login-page__loader">Cargando...</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="login-page__divider">
            <span>o continúa con</span>
          </div>

          <!-- Social login -->
          <div class="login-page__social">
            <button type="button" class="login-page__social-btn login-page__social-btn--google">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button type="button" class="login-page__social-btn login-page__social-btn--apple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 2.27-.37 4.01 1.09 5.84 1.21 1.66 2.2 2.28 2.71 2.28.15 0 .3-.03.45-.09l.77-.28c.5-.18.99-.46 1.16-.71.14-.2.14-.51.03-.85-2.09-6.34-3.32-8.21-4.17-9.07-1.1-1.1-2.45-1.7-4.16-1.7-.98 0-1.93.27-2.85.82-1.26.76-2.26 1.97-2.26 3.23s1.01 2.47 2.26 3.23c.92.55 1.87.82 2.85.82 1.06 0 2.07-.29 2.87-.87"/>
              </svg>
              Apple
            </button>
          </div>

          <!-- Sign up link -->
          <div class="login-page__signup">
            <p class="login-page__signup-text">
              ¿No tienes cuenta?
              <router-link to="/register" class="login-page__signup-link">Regístrate aquí</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success notification -->
    <transition name="fade">
      <div v-if="showSuccess" class="login-page__success">
        <div class="login-page__success-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>¡Sesión iniciada correctamente!</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Form state
const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const errors = ref<Record<string, string>>({
  email: '',
  password: '',
});

const showPassword = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Computed properties
const isFormValid = computed(() => {
  return (
    formData.value.email.trim() !== '' &&
    formData.value.password.trim() !== '' &&
    !errors.value.email &&
    !errors.value.password
  );
});

// Validation methods
const validateEmail = () => {
  const email = formData.value.email.trim();
  
  if (!email) {
    errors.value.email = 'El correo es requerido';
  } else if (!emailRegex.test(email)) {
    errors.value.email = 'Ingresa un correo válido';
  } else if (email.length > 254) {
    errors.value.email = 'El correo es muy largo';
  } else {
    errors.value.email = '';
  }
};

const validatePassword = () => {
  const password = formData.value.password;
  
  if (!password) {
    errors.value.password = 'La contraseña es requerida';
  } else if (password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (!/[A-Z]/.test(password)) {
    errors.value.password = 'Debe incluir mayúscula';
  } else if (!/[0-9]/.test(password)) {
    errors.value.password = 'Debe incluir un número';
  } else if (!/[!@#$%^&*]/.test(password)) {
    errors.value.password = 'Debe incluir un carácter especial';
  } else {
    errors.value.password = '';
  }
};

// Handle login
const handleLogin = async () => {
  validateEmail();
  validatePassword();

  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock authentication
    const mockUser = {
      id: 'user-' + Date.now(),
      email: formData.value.email,
      name: formData.value.email.split('@')[0],
      tier: 'silver',
      points: 1500,
      joinDate: new Date().toISOString(),
    };

    // Store user session (in real app, would be HTTP-only cookie or token)
    sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
    if (formData.value.rememberMe) {
      localStorage.setItem('rememberMe', formData.value.email);
    }

    showSuccess.value = true;

    // Redirect after success
    setTimeout(() => {
      // In real app: router.push('/dashboard')
      window.location.href = '/dashboard';
    }, 1000);
  } catch (error) {
    errors.value.password = 'Error al iniciar sesión. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
:root {
  --login-bg-primary: var(--color-cream-50);
  --login-bg-secondary: var(--color-cream-100);
  --login-text-primary: var(--color-slate-900);
  --login-text-secondary: var(--color-slate-500);
  --login-accent: var(--color-teal-500);
  --login-accent-hover: var(--color-teal-600);
  --login-border: rgba(94, 82, 64, 0.12);
  --login-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --login-bg-primary: var(--color-charcoal-700);
    --login-bg-secondary: var(--color-charcoal-800);
    --login-text-primary: var(--color-gray-200);
    --login-text-secondary: rgba(167, 169, 169, 0.7);
    --login-accent: var(--color-teal-300);
    --login-accent-hover: var(--color-teal-400);
    --login-border: rgba(119, 124, 124, 0.2);
    --login-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.login-page {
  position: relative;
  min-height: 100vh;
  background: var(--login-bg-primary);
  color: var(--login-text-primary);
  overflow: hidden;
  font-family: var(--font-family-base);
}

/* Background decoration */
.login-page__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.login-page__circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.login-page__circle--1 {
  width: 400px;
  height: 400px;
  background: var(--login-accent);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.login-page__circle--2 {
  width: 300px;
  height: 300px;
  background: var(--color-orange-500);
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

.login-page__circle--3 {
  width: 250px;
  height: 250px;
  background: var(--color-teal-600);
  top: 50%;
  left: 50%;
  animation-delay: 4s;
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
.login-page__container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  gap: var(--space-32);
  padding: var(--space-32);
}

/* Branding section */
.login-page__branding {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-24);
}

.login-page__logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--login-accent) 0%, var(--color-teal-600) 100%);
  border-radius: var(--radius-lg);
  color: white;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.login-page__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  background: linear-gradient(135deg, var(--login-accent) 0%, var(--color-teal-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-page__subtitle {
  font-size: var(--font-size-lg);
  color: var(--login-text-secondary);
  margin: 0;
}

/* Features list */
.login-page__features {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
}

.login-page__feature {
  display: flex;
  gap: var(--space-12);
  align-items: flex-start;
  padding: var(--space-16);
  border-radius: var(--radius-lg);
  background: rgba(var(--color-teal-500-rgb), 0.05);
  border: 1px solid var(--login-border);
  transition: all var(--duration-normal) var(--ease-standard);
}

.login-page__feature:hover {
  background: rgba(var(--color-teal-500-rgb), 0.1);
  transform: translateX(8px);
}

.login-page__feature-icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.login-page__feature-text {
  font-size: var(--font-size-base);
  color: var(--login-text-secondary);
  line-height: var(--line-height-normal);
}

/* Form section */
.login-page__form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-page__form-wrapper {
  width: 100%;
  max-width: 400px;
  background: var(--login-bg-secondary);
  border: 1px solid var(--login-border);
  border-radius: var(--radius-lg);
  padding: var(--space-32);
  box-shadow: var(--login-shadow);
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

.login-page__form-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-8) 0;
}

.login-page__form-subtitle {
  font-size: var(--font-size-base);
  color: var(--login-text-secondary);
  margin: 0 0 var(--space-24) 0;
}

/* Form */
.login-page__form {
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
  color: var(--login-text-primary);
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  font-size: var(--font-size-base);
  border: 1px solid var(--login-border);
  border-radius: var(--radius-base);
  background: var(--login-bg-primary);
  color: var(--login-text-primary);
  transition: all var(--duration-fast) var(--ease-standard);
}

.form-control:focus {
  outline: none;
  border-color: var(--login-accent);
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

/* Password wrapper */
.login-page__password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.login-page__password-toggle {
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

.login-page__password-toggle:hover {
  opacity: 1;
}

/* Forgot password link */
.login-page__forgot-link {
  font-size: var(--font-size-sm);
  color: var(--login-accent);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.login-page__forgot-link:hover {
  color: var(--login-accent-hover);
  text-decoration: underline;
}

/* Checkbox */
.login-page__checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin: var(--space-8) 0;
}

.login-page__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--login-accent);
}

.login-page__checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--login-text-secondary);
  cursor: pointer;
  user-select: none;
}

/* Loading state */
.login-page__loader {
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

/* Divider */
.login-page__divider {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  margin: var(--space-24) 0;
  font-size: var(--font-size-sm);
  color: var(--login-text-secondary);
}

.login-page__divider::before,
.login-page__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--login-border);
}

/* Social login */
.login-page__social {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
}

.login-page__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-10) var(--space-16);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--login-border);
  border-radius: var(--radius-base);
  background: var(--login-bg-primary);
  color: var(--login-text-primary);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-standard);
}

.login-page__social-btn:hover {
  border-color: var(--login-accent);
  background: rgba(var(--color-teal-500-rgb), 0.05);
  transform: translateY(-2px);
}

.login-page__social-btn--google:hover {
  color: #1f2937;
}

.login-page__social-btn--apple:hover {
  color: #000;
}

/* Sign up section */
.login-page__signup {
  margin-top: var(--space-24);
  text-align: center;
}

.login-page__signup-text {
  font-size: var(--font-size-sm);
  color: var(--login-text-secondary);
  margin: 0;
}

.login-page__signup-link {
  color: var(--login-accent);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.login-page__signup-link:hover {
  color: var(--login-accent-hover);
  text-decoration: underline;
}

/* Success notification */
.login-page__success {
  position: fixed;
  top: var(--space-32);
  right: var(--space-32);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-page__success-content {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-16) var(--space-20);
  background: var(--color-success);
  color: white;
  border-radius: var(--radius-base);
  box-shadow: var(--login-shadow);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .login-page__container {
    grid-template-columns: 1fr;
    gap: var(--space-24);
    padding: var(--space-24);
    min-height: auto;
  }

  .login-page__branding {
    display: none;
  }

  .login-page__form-wrapper {
    max-width: 100%;
  }

  .login-page__circle {
    opacity: 0.04;
  }
}

@media (max-width: 640px) {
  .login-page__container {
    padding: var(--space-16);
  }

  .login-page__form-wrapper {
    padding: var(--space-20);
  }

  .login-page__form-title {
    font-size: var(--font-size-xl);
  }

  .login-page__success {
    top: var(--space-16);
    right: var(--space-16);
    left: var(--space-16);
  }

  .login-page__circle--1 {
    width: 250px;
    height: 250px;
  }

  .login-page__circle--2 {
    width: 200px;
    height: 200px;
  }

  .login-page__circle--3 {
    width: 150px;
    height: 150px;
  }
}
</style>
