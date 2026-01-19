import { z } from 'zod'

/**
 * Points Operation Validation Schema
 * Validates create/update of points earn or redeem operations
 */
export const operationSchema = z.object({
  guestId: z
    .string('Guest is required')
    .min(1, 'Guest must be selected'),
  type: z
    .enum(['earn', 'redeem'], {
      errorMap: () => ({ message: 'Type must be either earn or redeem' }),
    })
    .default('earn'),
  points: z
    .number('Points must be a number')
    .int('Points must be an integer')
    .positive('Points must be positive')
    .min(1, 'Points must be at least 1')
    .max(100000, 'Points cannot exceed 100,000'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
})

export type OperationFormData = z.infer<typeof operationSchema>

/**
 * Quick Operation (for scanning cards)
 * Simplified version with pre-selected guest
 */
export const quickOperationSchema = z.object({
  type: z
    .enum(['earn', 'redeem'], {
      errorMap: () => ({ message: 'Type must be either earn or redeem' }),
    })
    .default('earn'),
  points: z
    .number('Points must be a number')
    .int('Points must be an integer')
    .positive('Points must be positive')
    .min(1, 'Points must be at least 1')
    .max(100000, 'Points cannot exceed 100,000'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
})

export type QuickOperationData = z.infer<typeof quickOperationSchema>
