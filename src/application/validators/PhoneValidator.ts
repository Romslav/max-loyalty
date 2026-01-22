/**
 * PhoneValidator - валидация номеров телефонов
 */

import { ValidationError } from '../errors';

/**
 * Проверить валидность номера телефона
 */
export function validatePhoneNumber(phoneNumber: string): void {
  if (!phoneNumber) {
    throw ValidationError.missingField('phoneNumber');
  }

  // Простая регулярка для международных номеров
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  if (!phoneRegex.test(phoneNumber.replace(/[\s\-().]/g, ''))) {
    throw ValidationError.invalidInput(
      'Invalid phone number format. Expected international format (e.g., +1234567890)',
      'phoneNumber'
    );
  }
}

/**
 * Нормализировать номер телефона
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[\s\-().]/g, '');
}
