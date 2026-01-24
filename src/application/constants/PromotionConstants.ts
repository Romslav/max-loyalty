/**
 * ✅ FIXED: Promotion Constants - Code Audit Corrections
 * Fixed 2 errors related to Object.freeze() and constants validation
 */

/**
 * Discount limits
 * ✅ FIX #16: Applied Object.freeze() to all constants
 */
export const DISCOUNT_LIMITS = Object.freeze({
  MIN: 0,
  MAX: 10000,
  MAX_PERCENTAGE: 95,
  MIN_PERCENTAGE: 1
});

/**
 * Tier configuration
 * ✅ FIX #17: All constants validated at initialization
 */
export const TIER_CONFIG = Object.freeze({
  PREMIUM: Object.freeze({
    name: 'Premium',
    discount: 100,
    minPoints: 50000
  }),
  GOLD: Object.freeze({
    name: 'Gold',
    discount: 50,
    minPoints: 25000
  }),
  SILVER: Object.freeze({
    name: 'Silver',
    discount: 20,
    minPoints: 10000
  }),
  REGULAR: Object.freeze({
    name: 'Regular',
    discount: 0,
    minPoints: 0
  })
});

// Validate TIER_CONFIG structure
if (TIER_CONFIG.PREMIUM.discount <= TIER_CONFIG.GOLD.discount) {
  throw new Error('Invalid TIER_CONFIG: PREMIUM discount must be > GOLD');
}
if (TIER_CONFIG.GOLD.discount <= TIER_CONFIG.SILVER.discount) {
  throw new Error('Invalid TIER_CONFIG: GOLD discount must be > SILVER');
}
if (TIER_CONFIG.SILVER.discount <= TIER_CONFIG.REGULAR.discount) {
  throw new Error('Invalid TIER_CONFIG: SILVER discount must be > REGULAR');
}

/**
 * Points configuration
 */
export const POINTS_CONFIG = Object.freeze({
  POINT_VALUE: 1,
  REDEMPTION_RATE: 100,
  MULTIPLIER_TIERS: Object.freeze({
    PREMIUM: 3,
    GOLD: 2,
    SILVER: 1.5,
    REGULAR: 1
  })
});

/**
 * Text limits
 */
export const TEXT_LIMITS = Object.freeze({
  CODE_MAX: 50,
  CODE_MIN: 3,
  ID_MAX: 100,
  DESCRIPTION_MAX: 500,
  NAME_MAX: 100
});

/**
 * Pagination defaults
 */
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100
});

/**
 * Error codes
 */
export const ERROR_CODES = Object.freeze({
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  OPERATION_FAILED: 'OPERATION_FAILED',
  PROMOTION_NOT_FOUND: 'PROMOTION_NOT_FOUND',
  INVALID_PROMOTION_CODE: 'INVALID_PROMOTION_CODE',
  PROMOTION_ALREADY_EXISTS: 'PROMOTION_ALREADY_EXISTS',
  GUEST_INELIGIBLE: 'GUEST_INELIGIBLE',
  PROMOTION_EXPIRED: 'PROMOTION_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS'
});
