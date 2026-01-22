/**
 * EmailValidator - валидация email адресов
 */

import { ValidationError } from '../errors';

/**
 * Проверить валидность email
 */
export function validateEmail(email: string): void {
  if (!email) {
    throw ValidationError.missingField('email');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ValidationError.invalidEmail(email);
  }

  if (email.length > 255) {
    throw ValidationError.invalidEmail(email);
  }
}

/**
 * Нормализировать email (привести к нижнему регистру)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
