/**
 * Validation Rules - Набор правил валидации
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

/**
 * Email validation
 */
export const emailRule: ValidationRule = {
  validate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message: 'Пожалуйста, введите корректный email',
};

/**
 * Password validation (min 8 chars, at least one number and letter)
 */
export const passwordRule: ValidationRule = {
  validate: (value: string) => {
    return value.length >= 8 && /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
  },
  message: 'Пароль должен быть не менее 8 символов с цифрами и буквами',
};

/**
 * Strong password (8+ chars, uppercase, lowercase, number, special char)
 */
export const strongPasswordRule: ValidationRule = {
  validate: (value: string) => {
    return (
      value.length >= 8 &&
      /[a-z]/.test(value) &&
      /[A-Z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[!@#$%^&*]/.test(value)
    );
  },
  message: 'Пароль должен содержать прописные, строчные буквы, цифры и спецсимволы',
};

/**
 * Phone validation (Russian format)
 */
export const phoneRule: ValidationRule = {
  validate: (value: string) => {
    const phoneRegex = /^\+?7\d{10}$/;
    return phoneRegex.test(value.replace(/[\s\-()]/g, ''));
  },
  message: 'Пожалуйста, введите корректный номер телефона',
};

/**
 * Required field
 */
export const requiredRule: ValidationRule = {
  validate: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== '';
  },
  message: 'Поле обязательно для заполнения',
};

/**
 * Min length
 */
export const minLengthRule = (min: number): ValidationRule => ({
  validate: (value: string) => value.length >= min,
  message: `Минимум ${min} символов`,
});

/**
 * Max length
 */
export const maxLengthRule = (max: number): ValidationRule => ({
  validate: (value: string) => value.length <= max,
  message: `Максимум ${max} символов`,
});

/**
 * Min value
 */
export const minRule = (min: number): ValidationRule => ({
  validate: (value: number) => value >= min,
  message: `Минимум ${min}`,
});

/**
 * Max value
 */
export const maxRule = (max: number): ValidationRule => ({
  validate: (value: number) => value <= max,
  message: `Максимум ${max}`,
});

/**
 * Exact match
 */
export const matchRule = (pattern: RegExp, message?: string): ValidationRule => ({
  validate: (value: string) => pattern.test(value),
  message: message || 'Неверный формат',
});

/**
 * Match two fields
 */
export const matchFieldsRule = (fieldValue: any): ValidationRule => ({
  validate: (value: any) => value === fieldValue,
  message: 'Поля не совпадают',
});

/**
 * Custom validator
 */
export const customRule = (validator: (value: any) => boolean, message: string): ValidationRule => ({
  validate: validator,
  message,
});

/**
 * URL validation
 */
export const urlRule: ValidationRule = {
  validate: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message: 'Пожалуйста, введите корректный URL',
};

/**
 * Numeric validation
 */
export const numericRule: ValidationRule = {
  validate: (value: any) => !isNaN(value) && value !== '',
  message: 'Пожалуйста, введите число',
};

/**
 * Integer validation
 */
export const integerRule: ValidationRule = {
  validate: (value: any) => Number.isInteger(Number(value)),
  message: 'Пожалуйста, введите целое число',
};

/**
 * Alphabetic validation
 */
export const alphabeticRule: ValidationRule = {
  validate: (value: string) => /^[a-zа-яё\s-]+$/i.test(value),
  message: 'Пожалуйста, используйте только буквы',
};

/**
 * Alphanumeric validation
 */
export const alphanumericRule: ValidationRule = {
  validate: (value: string) => /^[a-zа-яё0-9\s-]+$/i.test(value),
  message: 'Пожалуйста, используйте только буквы и цифры',
};
