/**
 * GuestValidator - валидация данных гостя
 */

import type { CreateGuestInput, UpdateGuestInput } from '../../domain/entities';
import { ValidationError } from '../errors';
import { validateEmail, normalizeEmail } from './EmailValidator';
import { validatePhoneNumber, normalizePhoneNumber } from './PhoneValidator';

/**
 * Валидировать данные для создания гостя
 */
export function validateCreateGuestInput(input: CreateGuestInput): void {
  const errors: Array<{ field: string; message: string }> = [];

  // Проверить email
  try {
    validateEmail(input.email);
  } catch (error: any) {
    errors.push({ field: 'email', message: error.message });
  }

  // Проверить номер телефона
  try {
    validatePhoneNumber(input.phoneNumber);
  } catch (error: any) {
    errors.push({ field: 'phoneNumber', message: error.message });
  }

  // Проверить firstName
  if (!input.firstName || input.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (input.firstName.length < 2 || input.firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
  }

  // Проверить lastName
  if (!input.lastName || input.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (input.lastName.length < 2 || input.lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
  }

  // Проверить restaurantId
  if (!input.restaurantId) {
    errors.push({ field: 'restaurantId', message: 'Restaurant ID is required' });
  }

  // Проверить initialPoints если нужно
  if (input.initialPoints !== undefined && input.initialPoints < 0) {
    errors.push({ field: 'initialPoints', message: 'Initial points cannot be negative' });
  }

  if (errors.length > 0) {
    throw ValidationError.multipleErrors(errors);
  }
}

/**
 * Нормализировать данные для создания
 */
export function normalizeCreateGuestInput(input: CreateGuestInput): CreateGuestInput {
  return {
    ...input,
    email: normalizeEmail(input.email),
    phoneNumber: normalizePhoneNumber(input.phoneNumber),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
  };
}

/**
 * Валидировать данные для обновления гостя
 */
export function validateUpdateGuestInput(input: UpdateGuestInput): void {
  const errors: Array<{ field: string; message: string }> = [];

  if (input.email !== undefined) {
    try {
      validateEmail(input.email);
    } catch (error: any) {
      errors.push({ field: 'email', message: error.message });
    }
  }

  if (input.phoneNumber !== undefined) {
    try {
      validatePhoneNumber(input.phoneNumber);
    } catch (error: any) {
      errors.push({ field: 'phoneNumber', message: error.message });
    }
  }

  if (input.firstName !== undefined) {
    if (input.firstName.length < 2 || input.firstName.length > 50) {
      errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
    }
  }

  if (input.lastName !== undefined) {
    if (input.lastName.length < 2 || input.lastName.length > 50) {
      errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
    }
  }

  if (errors.length > 0) {
    throw ValidationError.multipleErrors(errors);
  }
}
