import { z } from 'zod'

/**
 * Login Form Validation Schema
 * Validates email and password for login form
 */
export const loginSchema = z.object({
  email: z
    .string('Email is required')
    .email('Invalid email address')
    .min(3, 'Email must be at least 3 characters'),
  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Register Form Validation Schema
 * Validates all fields for user registration
 */
export const registerSchema = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string('Email is required')
    .email('Invalid email address')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email must be at most 255 characters'),
  phone: z
    .string('Phone is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits, optionally starting with +')
    .optional()
    .or(z.literal('')),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string('Confirm password is required')
    .min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Change Password Validation Schema
 * Used in settings page for password changes
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string('Current password is required')
    .min(1, 'Current password is required'),
  newPassword: z
    .string('New password is required')
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password must be at most 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string('Confirm password is required')
    .min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
