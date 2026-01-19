import { z } from 'zod'

/**
 * Create/Edit Guest Validation Schema
 */
export const guestSchema = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string('Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters'),
  phone: z
    .string('Phone is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits'),
  tier: z
    .enum(['bronze', 'silver', 'gold', 'platinum'], {
      errorMap: () => ({ message: 'Invalid tier' }),
    })
    .default('bronze'),
})

export type GuestFormData = z.infer<typeof guestSchema>

/**
 * Guest Preferences Validation Schema
 */
export const guestPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  newsletter: z.boolean().default(false),
})

export type GuestPreferencesData = z.infer<typeof guestPreferencesSchema>

/**
 * Guest Profile Update Schema
 */
export const guestProfileUpdateSchema = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits')
    .optional()
    .or(z.literal('')),
  preferences: guestPreferencesSchema.optional(),
})

export type GuestProfileUpdateData = z.infer<typeof guestProfileUpdateSchema>
