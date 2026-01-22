/**
 * PasswordValidator - валидация паролей
 */

import { ValidationError } from '../errors';

/**
 * требования для пароля
 */
interface PasswordRequirements {
  minLength?: number;  // Минимальная длина (на умолчание: 8)
  requireUppercase?: boolean;  // Требуется верхний регистр
  requireLowercase?: boolean;  // Требуется нижний регистр
  requireNumbers?: boolean;    // Требуется цифры
  requireSpecialChars?: boolean; // Требуется спец. символы
}

/**
 * Валидация пароля
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {}
): void {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = requirements;

  if (!password) {
    throw ValidationError.missingField('password');
  }

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('at least one special character');
  }

  if (errors.length > 0) {
    throw ValidationError.invalidPassword(`Password must contain: ${errors.join(', ')}`);
  }
}
