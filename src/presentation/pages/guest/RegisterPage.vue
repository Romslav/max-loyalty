<template>
  <div class="register-page">
    <!-- Background decoration -->
    <div class="register-page__background">
      <div class="register-page__circle register-page__circle--1"></div>
      <div class="register-page__circle register-page__circle--2"></div>
      <div class="register-page__circle register-page__circle--3"></div>
    </div>

    <!-- Main container -->
    <div class="register-page__container">
      <!-- Left section - Benefits -->
      <div class="register-page__benefits">
        <div class="register-page__logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
            <path d="M32 12V52M12 32H52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="register-page__title">Crea tu cuenta</h1>
        <p class="register-page__subtitle">Comienza a ganar puntos hoy</p>
        
        <div class="register-page__benefits-list">
          <div class="register-page__benefit">
            <div class="register-page__benefit-icon">🎁</div>
            <div>
              <div class="register-page__benefit-title">200 puntos de bienvenida</div>
              <div class="register-page__benefit-desc">Al completar tu registro</div>
            </div>
          </div>
          <div class="register-page__benefit">
            <div class="register-page__benefit-icon">🏆</div>
            <div>
              <div class="register-page__benefit-title">Nivel Bronze automático</div>
              <div class="register-page__benefit-desc">Acceso a beneficios exclusivos</div>
            </div>
          </div>
          <div class="register-page__benefit">
            <div class="register-page__benefit-icon">📱</div>
            <div>
              <div class="register-page__benefit-title">Sincronización en dispositivos</div>
              <div class="register-page__benefit-desc">Acceso desde cualquier lugar</div>
            </div>
          </div>
          <div class="register-page__benefit">
            <div class="register-page__benefit-icon">🔐</div>
            <div>
              <div class="register-page__benefit-title">Seguridad de nivel bancario</div>
              <div class="register-page__benefit-desc">Protección de tus datos</div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="register-page__stats">
          <div class="register-page__stat">
            <div class="register-page__stat-value">50k+</div>
            <div class="register-page__stat-label">Miembros activos</div>
          </div>
          <div class="register-page__stat">
            <div class="register-page__stat-value">⭐4.8</div>
            <div class="register-page__stat-label">Calificación</div>
          </div>
        </div>
      </div>

      <!-- Right section - Form -->
      <div class="register-page__form-section">
        <div class="register-page__form-wrapper">
          <h2 class="register-page__form-title">Crear cuenta</h2>
          
          <!-- Form -->
          <form @submit.prevent="handleRegister" class="register-page__form">
            <!-- Name field -->
            <div class="form-group">
              <label for="fullname" class="form-label">Nombre completo *</label>
              <input
                id="fullname"
                v-model="formData.fullName"
                type="text"
                class="form-control"
                placeholder="Tu nombre"
                :class="{ 'form-control--error': errors.fullName }"
                @blur="validateFullName"
                required
              />
              <div v-if="errors.fullName" class="form-error">{{ errors.fullName }}</div>
            </div>

            <!-- Email field -->
            <div class="form-group">
              <label for="email" class="form-label">Correo electrónico *</label>
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

            <!-- Phone field -->
            <div class="form-group">
              <label for="phone" class="form-label">Número de teléfono</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                class="form-control"
                placeholder="+1 (555) 000-0000"
                :class="{ 'form-control--error': errors.phone }"
                @blur="validatePhone"
              />
              <div v-if="errors.phone" class="form-error">{{ errors.phone }}</div>
            </div>

            <!-- Country field -->
            <div class="form-group">
              <label for="country" class="form-label">País *</label>
              <select
                id="country"
                v-model="formData.country"
                class="form-control"
                :class="{ 'form-control--error': errors.country }"
                @blur="validateCountry"
                required
              >
                <option value="">Selecciona tu país</option>
                <option value="mx">México</option>
                <option value="ar">Argentina</option>
                <option value="co">Colombia</option>
                <option value="pe">Perú</option>
                <option value="cl">Chile</option>
                <option value="br">Brasil</option>
                <option value="es">España</option>
                <option value="us">Estados Unidos</option>
              </select>
              <div v-if="errors.country" class="form-error">{{ errors.country }}</div>
            </div>

            <!-- Password field -->
            <div class="form-group">
              <label for="password" class="form-label">Contraseña *</label>
              <div class="register-page__password-wrapper">
                <input
                  id="password"
                  v-model="formData.password"
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
                  class="register-page__password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="errors.password" class="form-error">{{ errors.password }}</div>
              
              <!-- Password strength indicator -->
              <div v-if="formData.password" class="register-page__password-strength">
                <div class="register-page__strength-bar">
                  <div
                    class="register-page__strength-fill"
                    :class="`register-page__strength-fill--${passwordStrength}`"
                    :style="{ width: passwordStrengthPercent + '%' }"
                  ></div>
                </div>
                <div class="register-page__strength-text" :class="`register-page__strength-text--${passwordStrength}`">
                  Contraseña {{ passwordStrengthLabel }}
                </div>
              </div>
            </div>

            <!-- Confirm password field -->
            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirmar contraseña *</label>
              <div class="register-page__password-wrapper">
                <input
                  id="confirm-password"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="••••••••"
                  :class="{ 'form-control--error': errors.confirmPassword }"
                  @blur="validateConfirmPassword"
                  required
                />
                <button
                  type="button"
                  class="register-page__password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</div>
            </div>

            <!-- Interests checkboxes -->
            <div class="form-group">
              <label class="form-label">Tus intereses (opcional)</label>
              <div class="register-page__interests">
                <label v-for="interest in interests" :key="interest" class="register-page__interest-checkbox">
                  <input
                    type="checkbox"
                    :value="interest"
                    v-model="formData.interests"
                  />
                  <span>{{ interest }}</span>
                </label>
              </div>
            </div>

            <!-- Terms checkbox -->
            <div class="register-page__checkbox-group">
              <input
                id="terms"
                v-model="formData.agreeTerms"
                type="checkbox"
                class="register-page__checkbox"
                :class="{ 'register-page__checkbox--error': errors.agreeTerms }"
                required
              />
              <label for="terms" class="register-page__checkbox-label">
                Acepto los
                <router-link to="/terms" class="register-page__link">términos de servicio</router-link>
                y la
                <router-link to="/privacy" class="register-page__link">política de privacidad</router-link>
              </label>
            </div>
            <div v-if="errors.agreeTerms" class="form-error">{{ errors.agreeTerms }}</div>

            <!-- Newsletter checkbox -->
            <div class="register-page__checkbox-group">
              <input
                id="newsletter"
                v-model="formData.newsletter"
                type="checkbox"
                class="register-page__checkbox"
              />
              <label for="newsletter" class="register-page__checkbox-label">
                Quiero recibir ofertas y noticias exclusivas
              </label>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              class="btn btn--primary btn--lg btn--full-width"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="!isLoading">Crear mi cuenta</span>
              <span v-else class="register-page__loader">Creando cuenta...</span>
            </button>
          </form>

          <!-- Login link -->
          <div class="register-page__login">
            <p class="register-page__login-text">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="register-page__login-link">Inicia sesión aquí</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success notification -->
    <transition name="fade">
      <div v-if="showSuccess" class="register-page__success">
        <div class="register-page__success-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>¡Cuenta creada exitosamente!</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Form state
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  country: '',
  password: '',
  confirmPassword: '',
  interests: [] as string[],
  agreeTerms: false,
  newsletter: false,
});

const errors = ref<Record<string, string>>({
  fullName: '',
  email: '',
  phone: '',
  country: '',
  password: '',
  confirmPassword: '',
  agreeTerms: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);
const passwordStrength = ref<'weak' | 'fair' | 'good' | 'strong'>('weak');

const interests = ['Deportes', 'Viajes', 'Tecnología', 'Moda', 'Gastronomía', 'Cine'];

// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// Computed properties
const isFormValid = computed(() => {
  return (
    formData.value.fullName.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    formData.value.country !== '' &&
    formData.value.password.trim() !== '' &&
    formData.value.confirmPassword.trim() !== '' &&
    formData.value.agreeTerms &&
    !errors.value.fullName &&
    !errors.value.email &&
    !errors.value.phone &&
    !errors.value.country &&
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

// Password strength calculation
const updatePasswordStrength = () => {
  const password = formData.value.password;
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()\-_+=\[\]{};:'"<>,.?/\\|`~]/.test(password)) strength++;

  const levels = ['weak', 'fair', 'good', 'strong'] as const;
  passwordStrength.value = levels[Math.min(strength - 1, 3)];
};

// Validation methods
const validateFullName = () => {
  const name = formData.value.fullName.trim();
  
  if (!name) {
    errors.value.fullName = 'El nombre completo es requerido';
  } else if (name.length < 3) {
    errors.value.fullName = 'El nombre debe tener al menos 3 caracteres';
  } else if (name.length > 100) {
    errors.value.fullName = 'El nombre es muy largo';
  } else if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(name)) {
    errors.value.fullName = 'El nombre solo puede contener letras';
  } else {
    errors.value.fullName = '';
  }
};

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

const validatePhone = () => {
  const phone = formData.value.phone.trim();
  
  if (phone && !phoneRegex.test(phone)) {
    errors.value.phone = 'Ingresa un teléfono válido';
  } else {
    errors.value.phone = '';
  }
};

const validateCountry = () => {
  if (!formData.value.country) {
    errors.value.country = 'Selecciona tu país';
  } else {
    errors.value.country = '';
  }
};

const validatePassword = () => {
  const password = formData.value.password;
  
  if (!password) {
    errors.value.password = 'La contraseña es requerida';
  } else if (password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
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
  const password = formData.value.password;
  const confirmPassword = formData.value.confirmPassword;
  
  if (!confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña';
  } else if (confirmPassword !== password) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
  } else {
    errors.value.confirmPassword = '';
  }
};

// Handle registration
const handleRegister = async () => {
  validateFullName();
  validateEmail();
  validatePhone();
  validateCountry();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock user creation
    const newUser = {
      id: 'user-' + Date.now(),
      fullName: formData.value.fullName,
      email: formData.value.email,
      phone: formData.value.phone,
      country: formData.value.country,
      interests: formData.value.interests,
      tier: 'bronze',
      points: 200,
      joinDate: new Date().toISOString(),
      newsletter: formData.value.newsletter,
    };

    // Store user session
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));

    showSuccess.value = true;

    // Redirect after success
    setTimeout(() => {
      // In real app: router.push('/dashboard')
      window.location.href = '/verify-email';
    }, 1500);
  } catch (error) {
    errors.value.email = 'Error al registrarse. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
:root {
  --register-bg-primary: var(--color-cream-50);
  --register-bg-secondary: var(--color-cream-100);
  --register-text-primary: var(--color-slate-900);
  --register-text-secondary: var(--color-slate-500);
  --register-accent: var(--color-teal-500);
  --register-accent-hover: var(--color-teal-600);
  --register-border: rgba(94, 82, 64, 0.12);
  --register-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --register-bg-primary: var(--color-charcoal-700);
    --register-bg-secondary: var(--color-charcoal-800);
    --register-text-primary: var(--color-gray-200);
    --register-text-secondary: rgba(167, 169, 169, 0.7);
    --register-accent: var(--color-teal-300);
    --register-accent-hover: var(--color-teal-400);
    --register-border: rgba(119, 124, 124, 0.2);
    --register-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.register-page {
  position: relative;
  min-height: 100vh;
  background: var(--register-bg-primary);
  color: var(--register-text-primary);
  overflow: hidden;
  font-family: var(--font-family-base);
  padding: var(--space-32) 0;
}

/* Background decoration */
.register-page__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.register-page__circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.register-page__circle--1 {
  width: 400px;
  height: 400px;
  background: var(--register-accent);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.register-page__circle--2 {
  width: 300px;
  height: 300px;
  background: var(--color-orange-500);
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

.register-page__circle--3 {
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
.register-page__container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-32);
  padding: var(--space-32);
  max-width: 1400px;
  margin: 0 auto;
}

/* Benefits section */
.register-page__benefits {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-24);
}

.register-page__logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--register-accent) 0%, var(--color-teal-600) 100%);
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

.register-page__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  background: linear-gradient(135deg, var(--register-accent) 0%, var(--color-teal-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-page__subtitle {
  font-size: var(--font-size-lg);
  color: var(--register-text-secondary);
  margin: 0;
}

/* Benefits list */
.register-page__benefits-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.register-page__benefit {
  display: flex;
  gap: var(--space-12);
  align-items: flex-start;
  padding: var(--space-16);
  border-radius: var(--radius-lg);
  background: rgba(var(--color-teal-500-rgb), 0.05);
  border: 1px solid var(--register-border);
  transition: all var(--duration-normal) var(--ease-standard);
}

.register-page__benefit:hover {
  background: rgba(var(--color-teal-500-rgb), 0.1);
  transform: translateX(8px);
}

.register-page__benefit-icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.register-page__benefit-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--register-text-primary);
}

.register-page__benefit-desc {
  font-size: var(--font-size-sm);
  color: var(--register-text-secondary);
}

/* Stats */
.register-page__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  margin-top: var(--space-16);
  padding-top: var(--space-24);
  border-top: 1px solid var(--register-border);
}

.register-page__stat {
  text-align: center;
}

.register-page__stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--register-accent);
}

.register-page__stat-label {
  font-size: var(--font-size-sm);
  color: var(--register-text-secondary);
}

/* Form section */
.register-page__form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-page__form-wrapper {
  background: var(--register-bg-secondary);
  border: 1px solid var(--register-border);
  border-radius: var(--radius-lg);
  padding: var(--space-32);
  box-shadow: var(--register-shadow);
  animation: slideUp 0.6s ease-out;
  max-height: 90vh;
  overflow-y: auto;
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

.register-page__form-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
}

/* Form */
.register-page__form {
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
  color: var(--register-text-primary);
}

.form-control {
  width: 100%;
  padding: var(--space-12) var(--space-16);
  font-size: var(--font-size-base);
  border: 1px solid var(--register-border);
  border-radius: var(--radius-base);
  background: var(--register-bg-primary);
  color: var(--register-text-primary);
  transition: all var(--duration-fast) var(--ease-standard);
}

.form-control:focus {
  outline: none;
  border-color: var(--register-accent);
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
.register-page__password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.register-page__password-toggle {
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

.register-page__password-toggle:hover {
  opacity: 1;
}

/* Password strength */
.register-page__password-strength {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-8);
}

.register-page__strength-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.register-page__strength-fill {
  height: 100%;
  transition: all var(--duration-normal) var(--ease-standard);
}

.register-page__strength-fill--weak {
  background: var(--color-error);
}

.register-page__strength-fill--fair {
  background: var(--color-warning);
}

.register-page__strength-fill--good {
  background: var(--color-info);
}

.register-page__strength-fill--strong {
  background: var(--color-success);
}

.register-page__strength-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.register-page__strength-text--weak {
  color: var(--color-error);
}

.register-page__strength-text--fair {
  color: var(--color-warning);
}

.register-page__strength-text--good {
  color: var(--color-info);
}

.register-page__strength-text--strong {
  color: var(--color-success);
}

/* Interests -->
.register-page__interests {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
}

.register-page__interest-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-base);
  border: 1px solid var(--register-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.register-page__interest-checkbox:hover {
  background: rgba(var(--color-teal-500-rgb), 0.05);
  border-color: var(--register-accent);
}

.register-page__interest-checkbox input {
  accent-color: var(--register-accent);
}

.register-page__interest-checkbox span {
  font-size: var(--font-size-sm);
}

/* Checkboxes */
.register-page__checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
}

.register-page__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--register-accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.register-page__checkbox--error {
  border-color: var(--color-error);
}

.register-page__checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--register-text-secondary);
  cursor: pointer;
  line-height: var(--line-height-normal);
}

.register-page__link {
  color: var(--register-accent);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.register-page__link:hover {
  color: var(--register-accent-hover);
  text-decoration: underline;
}

/* Loading state */
.register-page__loader {
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

/* Login link */
.register-page__login {
  margin-top: var(--space-24);
  text-align: center;
}

.register-page__login-text {
  font-size: var(--font-size-sm);
  color: var(--register-text-secondary);
  margin: 0;
}

.register-page__login-link {
  color: var(--register-accent);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}

.register-page__login-link:hover {
  color: var(--register-accent-hover);
  text-decoration: underline;
}

/* Success notification */
.register-page__success {
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

.register-page__success-content {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-16) var(--space-20);
  background: var(--color-success);
  color: white;
  border-radius: var(--radius-base);
  box-shadow: var(--register-shadow);
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
@media (max-width: 1200px) {
  .register-page__container {
    grid-template-columns: 1fr;
    gap: var(--space-24);
    padding: var(--space-24);
  }

  .register-page__benefits {
    display: none;
  }
}

@media (max-width: 640px) {
  .register-page {
    padding: var(--space-16) 0;
  }

  .register-page__container {
    padding: var(--space-16);
  }

  .register-page__form-wrapper {
    padding: var(--space-20);
    max-height: 100vh;
  }

  .register-page__form-title {
    font-size: var(--font-size-xl);
  }

  .register-page__interests {
    grid-template-columns: 1fr;
  }

  .register-page__success {
    top: var(--space-16);
    right: var(--space-16);
    left: var(--space-16);
  }
}
</style>
