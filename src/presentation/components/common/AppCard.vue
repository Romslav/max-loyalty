<template>
  <div :class="['card', { 'card--hover': hover }]">
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AppCardProps {
  hover?: boolean;
}

defineProps<AppCardProps>();
</script>

<style scoped>
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-standard);
}

.card--hover:hover {
  box-shadow: var(--shadow-md);
}

.card__header {
  padding: var(--space-16);
  border-bottom: 1px solid var(--color-card-border-inner);
}

.card__body {
  padding: var(--space-16);
}

.card__footer {
  padding: var(--space-16);
  border-top: 1px solid var(--color-card-border-inner);
  background: var(--color-background);
}
</style>
