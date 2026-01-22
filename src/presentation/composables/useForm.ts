/**
 * useForm composable - управление формой с валидацией
 */

import { ref, computed } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * Validator function
 */
export type ValidatorFn = (value: any) => string | null;

/**
 * Form field config
 */
export interface FormFieldConfig {
  validators?: ValidatorFn[];
  defaultValue?: any;
}

/**
 * Form config
 */
export interface FormConfig {
  [fieldName: string]: FormFieldConfig;
}

/**
 * Form errors
 */
export interface FormErrors {
  [fieldName: string]: string | null;
}

/**
 * useForm composable
 */
export function useForm<T extends Record<string, any>>(
  config: FormConfig,
  onSubmit: (data: T) => Promise<void> | void
) {
  // State
  const formData = ref<T>(getDefaultFormData() as T);
  const errors = ref<FormErrors>({});
  const touched = ref<Record<string, boolean>>({});
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  /**
   * Get default form data from config
   */
  function getDefaultFormData(): Partial<T> {
    const data: Partial<T> = {};
    for (const [fieldName, fieldConfig] of Object.entries(config)) {
      data[fieldName as keyof T] = fieldConfig.defaultValue ?? '';
    }
    return data;
  }

  /**
   * Get validators for field
   */
  function getFieldValidators(fieldName: string): ValidatorFn[] {
    return config[fieldName]?.validators ?? [];
  }

  /**
   * Validate single field
   */
  function validateField(fieldName: string): string | null {
    const value = formData.value[fieldName as keyof T];
    const validators = getFieldValidators(fieldName);

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.value[fieldName] = error;
        return error;
      }
    }

    errors.value[fieldName] = null;
    return null;
  }

  /**
   * Validate all fields
   */
  function validateForm(): boolean {
    let isValid = true;

    for (const fieldName of Object.keys(config)) {
      const error = validateField(fieldName);
      if (error) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Mark field as touched
   */
  function touchField(fieldName: string): void {
    touched.value[fieldName] = true;
  }

  /**
   * Reset form
   */
  function reset(): void {
    formData.value = getDefaultFormData() as T;
    errors.value = {};
    touched.value = {};
    submitError.value = null;
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(): Promise<void> {
    // Mark all fields as touched
    for (const fieldName of Object.keys(config)) {
      touched.value[fieldName] = true;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit
    isSubmitting.value = true;
    submitError.value = null;

    try {
      await onSubmit(formData.value);
    } catch (err) {
      if (err instanceof Error) {
        submitError.value = err.message;
      } else {
        submitError.value = 'An unexpected error occurred';
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  /**
   * Update field value
   */
  function setFieldValue(fieldName: string, value: any): void {
    formData.value[fieldName as keyof T] = value;
  }

  /**
   * Get field error
   */
  function getFieldError(fieldName: string): string | null {
    if (!touched.value[fieldName]) {
      return null;
    }
    return errors.value[fieldName] ?? null;
  }

  /**
   * Check if form is valid
   */
  const isValid = computed((): boolean => {
    return Object.values(errors.value).every((error) => error === null);
  });

  /**
   * Check if form is dirty
   */
  const isDirty = computed((): boolean => {
    return Object.values(touched.value).some((t) => t === true);
  });

  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    submitError,
    // Getters
    isValid,
    isDirty,
    // Methods
    validateField,
    validateForm,
    touchField,
    reset,
    handleSubmit,
    setFieldValue,
    getFieldError,
  };
}
