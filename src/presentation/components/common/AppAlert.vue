<template>
  <transition name="fade">
    <div v-if="modelValue" :class="['alert', `alert--${type}`]" role="alert">
      <div class="alert__icon">{{ getIcon() }}</div>
      <div class="alert__content">
        <p class="alert__title">{{ title }}</p>
        <p v-if="message" class="alert__message">{{ message }}</p>
      </div>
      <button v-if="closeable" class="alert__close" @click="$emit('update:modelValue', false)">×</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
export interface AppAlertProps {
  modelValue: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  closeable?: boolean;
}

defineProps<AppAlertProps>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function getIcon() {
  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  return icons[arguments[0]] || '•';
}
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  border-radius: var(--radius-base);
  border-left: 4px solid;
}

.alert--success {
  background: rgba(var(--color-success-rgb), var(--status-bg-opacity));
  border-color: var(--color-success);
  color: var(--color-success);
}

.alert--error {
  background: rgba(var(--color-error-rgb), var(--status-bg-opacity));
  border-color: var(--color-error);
  color: var(--color-error);
}

.alert--warning {
  background: rgba(var(--color-warning-rgb), var(--status-bg-opacity));
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.alert--info {
  background: rgba(var(--color-info-rgb), var(--status-bg-opacity));
  border-color: var(--color-info);
  color: var(--color-info);
}

.alert__icon {
  font-size: var(--font-size-lg);
  font-weight: bold;
  flex-shrink: 0;
}

.alert__content {
  flex: 1;
}

.alert__title {
  margin: 0;
  font-weight: var(--font-weight-semibold);
}

.alert__message {
  margin: var(--space-4) 0 0 0;
  font-size: var(--font-size-sm);
}

.alert__close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity var(--duration-fast) var(--ease-standard);
}

.alert__close:hover {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-standard);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
