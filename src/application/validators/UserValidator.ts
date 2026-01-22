/**
 * UserValidator - валидация данных пользователя
 */

import type { CreateUserInput, UpdateUserInput, UserRole } from '../../domain/entities';
import { ValidationError } from '../errors';
import { validateEmail, normalizeEmail } from './EmailValidator';
import { validatePassword } from './PasswordValidator';

const VALID_ROLES: UserRole[] = ['admin', 'restaurant', 'cashier', 'guest'];

/**
 * Валидировать данные для создания пользователя
 */
export function validateCreateUserInput(input: CreateUserInput): void {
  const errors: Array<{ field: string; message: string }> = [];

  // Проверить email
  try {
    validateEmail(input.email);
  } catch (error: any) {
    errors.push({ field: 'email', message: error.message });
  }

  // Проверить name
  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (input.name.length < 2 || input.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
  }

  // Проверить пароль
  try {
    validatePassword(input.password);
  } catch (error: any) {
    errors.push({ field: 'password', message: error.message });
  }

  // Проверить role
  if (!input.role || !VALID_ROLES.includes(input.role)) {
    errors.push({ field: 'role', message: `Role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  // Проверить restaurantId для restaurant роли
  if ((input.role === 'restaurant' || input.role === 'cashier') && !input.restaurantId) {
    errors.push({ field: 'restaurantId', message: 'Restaurant ID is required for this role' });
  }

  if (errors.length > 0) {
    throw ValidationError.multipleErrors(errors);
  }
}

/**
 * Нормализировать данные для создания
 */
export function normalizeCreateUserInput(input: CreateUserInput): CreateUserInput {
  return {
    ...input,
    email: normalizeEmail(input.email),
    name: input.name.trim(),
  };
}

/**
 * Валидировать данные для обновления пользователя
 */
export function validateUpdateUserInput(input: UpdateUserInput): void {
  const errors: Array<{ field: string; message: string }> = [];

  // Проверить email если необходимо
  if (input.email !== undefined) {
    try {
      validateEmail(input.email);
    } catch (error: any) {
      errors.push({ field: 'email', message: error.message });
    }
  }

  // Проверить name если необходимо
  if (input.name !== undefined) {
    if (input.name.length < 2 || input.name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
    }
  }

  // Проверить пароль если необходимо
  if (input.password !== undefined) {
    try {
      validatePassword(input.password);
    } catch (error: any) {
      errors.push({ field: 'password', message: error.message });
    }
  }

  if (errors.length > 0) {
    throw ValidationError.multipleErrors(errors);
  }
}
