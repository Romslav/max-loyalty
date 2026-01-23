<template>
  <div class="not-found">
    <div class="not-found-container">
      <div class="not-found-code">404</div>
      <h1 class="not-found-title">Страница не найдена</h1>
      <p class="not-found-description">К сожалению, запрашиваемая страница не существует.</p>
      <router-link to="/" class="btn btn--primary btn--lg">На главную</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 page
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-cream-50);
  padding: var(--space-32);
}

.not-found-container {
  text-align: center;
}

.not-found-code {
  font-size: 120px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-16);
}

.not-found-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
  color: var(--color-slate-900);
}

.not-found-description {
  font-size: var(--font-size-lg);
  color: var(--color-slate-500);
  margin: 0 0 var(--space-24) 0;
}

@media (max-width: 640px) {
  .not-found-code {
    font-size: 80px;
  }

  .not-found-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
