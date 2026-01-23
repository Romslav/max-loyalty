/**
 * useForm Composable - Оставление формы с валидацией
 */

import { ref, reactive, computed } from 'vue';
import { FieldValidator, FieldError } from '@/shared/validators/field-validator';
import { ValidationRule } from '@/shared/validators/rules';

interface FormOptions<T> {
  initialValues: T;
  validationSchema?: Record<keyof T, ValidationRule[]>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>(options: FormOptions<T>) => {
  const { initialValues, validationSchema = {}, onSubmit } = options;

  // State
  const values = reactive<T>(structuredClone(initialValues));
  const errors = ref<FieldError[]>([]);
  const touched = reactive<Record<keyof T, boolean>>({});
  const isDirty = ref(false);
  const isSubmitting = ref(false);
  const submitCount = ref(0);

  // Computed
  const isValid = computed(() => {
    const result = FieldValidator.validateFields(values, validationSchema as any);
    return result.valid;
  });

  const hasErrors = computed(() => errors.value.length > 0);

  const isFormTouched = computed(() => {
    return Object.values(touched).some(val => val === true);
  });

  /**
   * Отметить поле как тронутое
   */
  const setTouched = (field: keyof T, value: boolean = true) => {
    touched[field] = value;
  };

  /**
   * Маркировать все поля как тронутые
   */
  const setAllTouched = () => {
    Object.keys(values).forEach(field => {
      touched[field as keyof T] = true;
    });
  };

  /**
   * Остановить значение поля
   */
  const setFieldValue = (field: keyof T, value: any) => {
    values[field] = value;
    isDirty.value = true;
  };

  /**
   * Остановить значения нескольких полей
   */
  const setValues = (newValues: Partial<T>) => {
    Object.assign(values, newValues);
    isDirty.value = true;
  };

  /**
   * Остановить ошибки
   */
  const setErrors = (newErrors: FieldError[]) => {
    errors.value = newErrors;
  };

  /**
   * Остановить ошибку поля
   */
  const setFieldError = (field: keyof T, message: string) => {
    const existingIndex = errors.value.findIndex(e => e.field === field);
    if (existingIndex >= 0) {
      errors.value[existingIndex].message = message;
    } else {
      errors.value.push({ field: field as string, message });
    }
  };

  /**
   * Очистить ошибки поля
   */
  const clearFieldErrors = (field: keyof T) => {
    errors.value = errors.value.filter(e => e.field !== field);
  };

  /**
   * Очистить все ошибки
   */
  const clearErrors = () => {
    errors.value = [];
  };

  /**
   * Очистить форму
   */
  const reset = () => {
    Object.assign(values, structuredClone(initialValues));
    errors.value = [];
    Object.keys(touched).forEach(key => {
      touched[key as keyof T] = false;
    });
    isDirty.value = false;
    submitCount.value = 0;
  };

  /**
   * Валидировать одно поле
   */
  const validateField = (field: keyof T) => {
    const rules = validationSchema[field] || [];
    const value = values[field];
    const result = FieldValidator.validate(value, rules);

    if (!result.valid) {
      result.errors.forEach(err => {
        setFieldError(field, err.message);
      });
    } else {
      clearFieldErrors(field);
    }

    return result.valid;
  };

  /**
   * Валидировать всю форму
   */
  const validate = () => {
    const result = FieldValidator.validateFields(values, validationSchema as any);
    setErrors(result.errors);
    return result.valid;
  };

  /**
   * Отправить форму
   */
  const handleSubmit = async () => {
    submitCount.value++;
    setAllTouched();

    if (!validate()) {
      return;
    }

    isSubmitting.value = true;
    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Обработчик onBlur
   */
  const handleBlur = (field: keyof T) => {
    setTouched(field, true);
    validateField(field);
  };

  /**
   * Обработчик onChange
   */
  const handleChange = (field: keyof T, value: any) => {
    setFieldValue(field, value);
    if (touched[field]) {
      validateField(field);
    }
  };

  /**
   * Получить ошибки поля
   */
  const getFieldErrors = (field: keyof T): string[] => {
    return FieldValidator.getFieldErrors(errors.value, field as string);
  };

  /**
   * Получить статус поля
   */
  const getFieldStatus = (field: keyof T) => {
    const hasError = FieldValidator.hasFieldError(errors.value, field as string);
    const isTouched = touched[field];

    return {
      error: hasError && isTouched,
      success: !hasError && isTouched && values[field] !== '',
      pristine: !isTouched,
    };
  };

  return {
    // State
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    submitCount,
    // Computed
    isValid,
    hasErrors,
    isFormTouched,
    // Methods
    setTouched,
    setAllTouched,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    clearFieldErrors,
    clearErrors,
    reset,
    validateField,
    validate,
    handleSubmit,
    handleBlur,
    handleChange,
    getFieldErrors,
    getFieldStatus,
  };
};
