/**
 * Promotion Constants
 * 
 * Centralized constants for promotion business rules.
 * Production-ready configuration.
 */

/**
 * Points calculation
 */
export const POINTS_CONFIG = {
  POINTS_PER_CURRENCY: 0.1, // 1 point per 10 currency units
  MIN_ORDER_FOR_POINTS: 1, // Minimum order to earn points
} as const

/**
 * Usage warnings
 */
export const USAGE_WARNINGS = {
  HIGH_USAGE_THRESHOLD: 0.8, // 80% usage
  EXPIRY_WARNING_DAYS: 3, // Warn if expiring in 3 days
} as const

/**
 * Text length limits
 */
export const TEXT_LIMITS = {
  PROMOTION_NAME_MAX: 200,
  PROMOTION_DESCRIPTION_MAX: 1000,
  PROMOTION_CODE_MIN: 3,
  PROMOTION_CODE_MAX: 20,
} as const

/**
 * Promotion code generation
 */
export const CODE_GENERATION = {
  CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  LENGTH: 8,
  TIMESTAMP_CHARS: 3,
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  MAX_USAGE: 1000,
  DEFAULT_SCOPE: 'unlimited' as const,
  DEFAULT_PROMOTION_DURATION_DAYS: 30,
} as const

/**
 * Tier configurations
 */
export const TIER_CONFIG = {
  AVAILABLE_TIERS: ['bronze', 'silver', 'gold', 'platinum', 'vip'],
  TIER_MULTIPLIERS: {
    bronze: 1.0,
    silver: 1.05,
    gold: 1.1,
    platinum: 1.15,
    vip: 1.25,
  },
} as const

/**
 * Discount limits
 */
export const DISCOUNT_LIMITS = {
  PERCENTAGE_MAX: 100,
  PERCENTAGE_MIN: 0.01,
  FIXED_AMOUNT_MIN: 0.01,
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

/**
 * Error codes
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  PROMOTION_NOT_FOUND: 'PROMOTION_NOT_FOUND',
  INVALID_CODE: 'INVALID_CODE',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  GUEST_INELIGIBLE: 'GUEST_INELIGIBLE',
  EXPIRED: 'EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const

export default {
  POINTS_CONFIG,
  USAGE_WARNINGS,
  TEXT_LIMITS,
  CODE_GENERATION,
  DEFAULTS,
  TIER_CONFIG,
  DISCOUNT_LIMITS,
  PAGINATION,
  ERROR_CODES,
}
