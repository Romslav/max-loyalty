<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h1 class="error-title">Ошибка сервера</h1>
      <p class="error-description">{{ errorMessage }}</p>
      <button type="button" class="btn btn--primary btn--lg" @click="handleReturn">
        На главную
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  errorMessage?: string;
}>();

const handleReturn = () => {
  window.location.href = '/';
};
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-cream-50);
  padding: var(--space-32);
}

.error-container {
  text-align: center;
}

.error-icon {
  font-size: 80px;
  margin-bottom: var(--space-16);
}

.error-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
  color: var(--color-slate-900);
}

.error-description {
  font-size: var(--font-size-lg);
  color: var(--color-slate-500);
  margin: 0 0 var(--space-24) 0;
  line-height: var(--line-height-normal);
}
</style>
