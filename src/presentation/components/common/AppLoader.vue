<template>
  <div :class="['loader', `loader--${size}`]">
    <div class="loader__spinner"></div>
    <p v-if="message" class="loader__message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
export interface AppLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

defineProps<AppLoaderProps>();
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-16);
  padding: var(--space-32);
}

.loader__spinner {
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader--sm .loader__spinner {
  width: 24px;
  height: 24px;
}

.loader--md .loader__spinner {
  width: 40px;
  height: 40px;
}

.loader--lg .loader__spinner {
  width: 60px;
  height: 60px;
}

.loader__message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  margin: 0;
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
