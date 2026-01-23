/**
 * Field Validator - Валидатор отдельных полей
 */

import { ValidationRule } from './rules';

export interface FieldError {
  field: string;
  message: string;
  rule?: string;
}

export interface FieldValidationResult {
  valid: boolean;
  errors: FieldError[];
}

export class FieldValidator {
  /**
   * Валидировать одно поле
   */
  static validate(value: any, rules: ValidationRule[]): FieldValidationResult {
    const errors: FieldError[] = [];

    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push({
          field: '',
          message: rule.message,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидировать несколько полей
   */
  static validateFields(
    data: Record<string, any>,
    schema: Record<string, ValidationRule[]>
  ): {
    valid: boolean;
    errors: FieldError[];
  } {
    const errors: FieldError[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const result = this.validate(value, rules);

      if (!result.valid) {
        errors.push(
          ...result.errors.map(err => ({
            ...err,
            field,
          }))
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Получить ошибки для конкретного поля
   */
  static getFieldErrors(errors: FieldError[], field: string): string[] {
    return errors
      .filter(err => err.field === field)
      .map(err => err.message);
  }

  /**
   * Проверить, есть ли ошибки для поля
   */
  static hasFieldError(errors: FieldError[], field: string): boolean {
    return errors.some(err => err.field === field);
  }
}
