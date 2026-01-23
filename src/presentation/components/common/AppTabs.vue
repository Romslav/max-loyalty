<template>
  <div class="app-tabs">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-button"
        :class="{ 'active': modelValue === tab.value }"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue';

interface Tab {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});

const emit = defineEmits<Emits>();

const tabs = ref<Tab[]>([]);

/**
 * Register tab
 */
function registerTab(label: string, value: string): void {
  if (!tabs.value.find(t => t.value === value)) {
    tabs.value.push({ label, value });
  }
}

/**
 * Unregister tab
 */
function unregisterTab(value: string): void {
  tabs.value = tabs.value.filter(t => t.value !== value);
}

/**
 * Select tab
 */
function selectTab(value: string): void {
  emit('update:modelValue', value);
}

/**
 * Provide tab context
 */
provide('appTabs', {
  registerTab,
  unregisterTab,
  activeTab: computed(() => props.modelValue),
});
</script>

<style scoped>
.app-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: var(--space-8);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  padding: var(--space-12) var(--space-16);
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--color-text);
  border-bottom-color: var(--color-border);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tabs-content {
  width: 100%;
}
</style>
