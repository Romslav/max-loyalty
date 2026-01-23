<template>
  <div
    v-if="isActive"
    class="app-tab"
    role="tabpanel"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from 'vue';

interface Props {
  label: string;
  value: string;
}

const props = defineProps<Props>();

interface TabsContext {
  registerTab: (label: string, value: string) => void;
  unregisterTab: (value: string) => void;
  activeTab: { value: string };
}

const appTabs = inject<TabsContext | null>('appTabs', null);

/**
 * Check if this tab is active
 */
const isActive = computed(() => {
  return appTabs?.activeTab.value === props.value;
});

/**
 * Register tab on mount
 */
onMounted(() => {
  if (appTabs) {
    appTabs.registerTab(props.label, props.value);
  }
});

/**
 * Unregister tab on unmount
 */
onUnmounted(() => {
  if (appTabs) {
    appTabs.unregisterTab(props.value);
  }
});
</script>

<style scoped>
.app-tab {
  width: 100%;
}
</style>
