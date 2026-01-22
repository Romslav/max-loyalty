<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input', { 'input--error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <p v-if="error" class="input-error">{{ error }}</p>
    <p v-if="help" class="input-help">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface AppInputProps {
  modelValue: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  label?: string;
  error?: string;
  help?: string;
  disabled?: boolean;
}

const props = defineProps<AppInputProps>();

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
  focus: [];
}>();
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.input-label {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.input {
  padding: var(--space-8) var(--space-12);
  font-size: var(--font-size-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-surface);
  color: var(--color-text);
  transition: all var(--duration-fast) var(--ease-standard);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.input--error {
  border-color: var(--color-error);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin: 0;
}

.input-help {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}
</style>
