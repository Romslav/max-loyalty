<template>
  <div class="profile">
    <!-- Головка -->
    <section class="profile-header">
      <div class="profile-avatar">{{ userProfile.avatar }}</div>
      <div class="profile-info">
        <h1 class="profile-name">{{ userProfile.fullName }}</h1>
        <p class="profile-email">{{ userProfile.email }}</p>
        <div class="profile-level">Номер члена: {{ userProfile.memberId }}</div>
      </div>
      <button type="button" class="btn btn--secondary btn--lg">{{ isEditing ? 'Сохранить' : 'Отредактировать' }}</button>
    </section>

    <!-- Основная информация -->
    <section class="profile-section">
      <h2 class="section-title">Основная информация</h2>
      <div class="form-group">
        <label class="form-label">Полное имя</label>
        <input type="text" class="form-control" v-model="userProfile.fullName" :disabled="!isEditing" />
      </div>
      <div class="form-group">
        <label class="form-label">Электронная почта</label>
        <input type="email" class="form-control" v-model="userProfile.email" :disabled="!isEditing" />
      </div>
      <div class="form-group">
        <label class="form-label">Номер телефона</label>
        <input type="tel" class="form-control" v-model="userProfile.phone" :disabled="!isEditing" />
      </div>
      <div class="form-group">
        <label class="form-label">Вторичный email</label>
        <input type="email" class="form-control" v-model="userProfile.secondaryEmail" :disabled="!isEditing" />
      </div>
    </section>

    <!-- Внешние привязки -->
    <section class="profile-section">
      <h2 class="section-title">Связанные аккаунты</h2>
      <div class="connections-grid">
        <div v-for="connection in connections" :key="connection.id" class="connection-card">
          <div class="connection-icon">{{ connection.icon }}</div>
          <div class="connection-name">{{ connection.name }}</div>
          <button 
            v-if="connection.connected"
            type="button" 
            class="btn btn--secondary btn--sm"
          >
            Отсоединить
          </button>
          <button 
            v-else
            type="button" 
            class="btn btn--primary btn--sm"
          >
            Подключить
          </button>
        </div>
      </div>
    </section>

    <!-- Предпочтения -->
    <section class="profile-section">
      <h2 class="section-title">Предпочтения и настройки</h2>
      <div class="preferences-list">
        <div v-for="pref in preferences" :key="pref.id" class="preference-item">
          <div class="preference-info">
            <div class="preference-title">{{ pref.title }}</div>
            <div class="preference-description">{{ pref.description }}</div>
          </div>
          <input type="checkbox" class="preference-toggle" v-model="pref.enabled" :disabled="!isEditing" />
        </div>
      </div>
    </section>

    <!-- Безопасность -->
    <section class="profile-section">
      <h2 class="section-title">Безопасность</h2>
      <div class="security-options">
        <button type="button" class="btn btn--secondary btn--lg btn--full-width">
          Изменить пароль
        </button>
        <button type="button" class="btn btn--secondary btn--lg btn--full-width">
          Вылогить из всех сессий
        </button>
      </div>
    </section>

    <!-- От Danger Zone -->
    <section class="profile-section danger-zone">
      <h2 class="section-title">Опасная зона</h2>
      <div class="danger-content">
        <div>
          <h3>Удалить аккаунт</h3>
          <p>Это действие необратимо</p>
        </div>
        <button type="button" class="btn btn--outline" style="border-color: var(--color-error); color: var(--color-error);">
          Удалить
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isEditing = ref(false);

const userProfile = ref({
  fullName: 'Ivan Petrov',
  email: 'ivan@example.com',
  phone: '+79991234567',
  secondaryEmail: 'ivan.alt@example.com',
  memberId: 'ML-2024001',
  avatar: '🤘',
});

const connections = [
  { id: 1, icon: 'f', name: 'Facebook', connected: true },
  { id: 2, icon: '🖱', name: 'Google', connected: false },
  { id: 3, icon: '🔐', name: 'Apple', connected: false },
];

const preferences = [
  {
    id: 1,
    title: 'Промобки по email',
    description: 'Получать эксклюзивные предложения',
    enabled: true,
  },
  {
    id: 2,
    title: 'Овестки в push',
    description: 'Открыть push-ывестки',
    enabled: true,
  },
  {
    id: 3,
    title: 'Мессажи SMS',
    description: 'Получать сообщения SMS',
    enabled: false,
  },
];
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-24);
}

/* Головка профиля */
.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-24);
  padding: var(--space-24);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-24);
}

.profile-avatar {
  font-size: 64px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-4) 0;
}

.profile-email {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-4) 0;
}

.profile-level {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

/* Секции -->
.profile-section {
  padding: var(--space-24);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-24);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-16) 0;
}

/* Форма -->
.form-group {
  margin-bottom: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.form-control {
  padding: var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-base);
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color var(--duration-normal) var(--ease-standard);
}

.form-control:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Связи -->
.connections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-16);
}

.connection-card {
  padding: var(--space-16);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  align-items: center;
}

.connection-icon {
  font-size: var(--font-size-2xl);
}

.connection-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Предпочтения -->
.preferences-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-16);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
}

.preference-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.preference-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.preference-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.preference-toggle {
  width: 48px;
  height: 24px;
  cursor: pointer;
}

/* Безопасность -->
.security-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

/* Опасная зона -->
.danger-zone {
  border-color: var(--color-error);
  background: rgba(var(--color-error-rgb), 0.05);
}

.danger-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
}

.danger-content h3 {
  margin: 0 0 var(--space-4) 0;
  color: var(--color-error);
}

.danger-content p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-section {
    padding: var(--space-16);
  }

  .danger-content {
    flex-direction: column;
  }
}
</style>
