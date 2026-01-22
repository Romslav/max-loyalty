<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading, 'btn--disabled': disabled }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn__loader">\u21bb</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
/**
 * AppButton Props
 */
export interface AppButtonProps {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disable button */
  disabled?: boolean;
  /** Show loading state */
  loading?: boolean;
}

defineProps<AppButtonProps>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-16);
  border-radius: var(--radius-base);
  font-weight: 500;
  font-size: var(--font-size-base);
  border: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-standard);
  outline: none;
}

.btn:focus-visible {
  outline: var(--focus-outline);
  outline-offset: 2px;
}

/* Variants */
.btn--primary {
  background: var(--color-primary);
  color: var(--color-btn-primary-text);
}

.btn--primary:hover {
  background: var(--color-primary-hover);
}

.btn--primary:active {
  background: var(--color-primary-active);
}

.btn--secondary {
  background: var(--color-secondary);
  color: var(--color-text);
}

.btn--secondary:hover {
  background: var(--color-secondary-hover);
}

.btn--danger {
  background: var(--color-error);
  color: white;
}

.btn--danger:hover {
  opacity: 0.9;
}

/* Sizes */
.btn--sm {
  padding: var(--space-4) var(--space-12);
  font-size: var(--font-size-sm);
}

.btn--lg {
  padding: var(--space-12) var(--space-20);
  font-size: var(--font-size-lg);
}

/* States */
.btn--disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--loading {
  opacity: 0.8;
}

.btn__loader {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
