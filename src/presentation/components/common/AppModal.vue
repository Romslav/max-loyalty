<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button
              class="modal-close-btn"
              @click="closeModal"
              title="Close"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  title: string;
  variant?: 'default' | 'danger' | 'success';
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const emit = defineEmits<Emits>();

const isOpen = ref(true);

/**
 * Close modal
 */
function closeModal(): void {
  isOpen.value = false;
  // Delay emit to allow animation
  setTimeout(() => {
    emit('close');
  }, 300);
}

/**
 * Handle overlay click (close on outside click)
 */
function handleOverlayClick(): void {
  closeModal();
}

/**
 * Handle escape key
 */
function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeModal();
  }
}

/**
 * Setup escape key handler
 */
watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-24);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.modal-close-btn:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.modal-close-btn:focus {
  outline: none;
  box-shadow: var(--focus-ring);
}

.modal-body {
  padding: var(--space-24);
  overflow-y: auto;
  flex: 1;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-normal) var(--ease-standard);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform var(--duration-normal) var(--ease-standard);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: calc(100% - 32px);
  }

  .modal-header {
    padding: var(--space-16);
  }

  .modal-body {
    padding: var(--space-16);
  }
}
</style>
