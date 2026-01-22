/**
 * Form Validators - Common validation functions
 */

import type { ValidatorFn } from '../composables/useForm';

/**
 * Required field validator
 */
export const required = (fieldName: string = 'This field'): ValidatorFn => {
  return (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  };
};

/**
 * Email validator
 */
export const email = (): ValidatorFn => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: string) => {
    if (!value) return null; // Let required validator handle empty
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  };
};

/**
 * Min length validator
 */
export const minLength = (length: number): ValidatorFn => {
  return (value: string) => {
    if (!value) return null;
    if (value.length < length) {
      return `Must be at least ${length} characters`;
    }
    return null;
  };
};

/**
 * Max length validator
 */
export const maxLength = (length: number): ValidatorFn => {
  return (value: string) => {
    if (!value) return null;
    if (value.length > length) {
      return `Must not exceed ${length} characters`;
    }
    return null;
  };
};

/**
 * Password strength validator
 */
export const passwordStrength = (): ValidatorFn => {
  return (value: string) => {
    if (!value) return null;

    // Check minimum length
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }

    // Check for uppercase
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }

    // Check for lowercase
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for number
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }

    return null;
  };
};

/**
 * Match fields validator (for password confirmation)
 */
export const matchField = (otherValue: any): ValidatorFn => {
  return (value: any) => {
    if (!value) return null;
    if (value !== otherValue) {
      return 'Fields do not match';
    }
    return null;
  };
};

/**
 * Phone number validator
 */
export const phoneNumber = (): ValidatorFn => {
  return (value: string) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  };
};

/**
 * Custom validator creator
 */
export const custom = (validatorFn: (value: any) => boolean, message: string): ValidatorFn => {
  return (value: any) => {
    if (!value) return null;
    if (!validatorFn(value)) {
      return message;
    }
    return null;
  };
};
