/**
 * CreateGuestUseCase
 * 
 * Main use case for creating guests in the loyalty program.
 * Handles validation, business rules, and persistence.
 * Production-ready with comprehensive error handling.
 */

import { Guest } from '../../../domain/entities/guest/Guest'
import { IGuestRepository } from '../../../domain/repositories/IGuestRepository'
import { GuestValidator, CreateGuestInput } from '../../validators/GuestValidator'
import {
  ValidationError,
  GuestNotFoundError,
  OperationFailedError,
} from '../../errors/PointsErrors'

/**
 * Use case output DTO
 */
export interface CreateGuestOutput {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  status: string
  tier: string
  referralCode: string
  joinedAt: Date
}

/**
 * Use case for creating guests
 */
export class CreateGuestUseCase {
  constructor(
    private guestRepository: IGuestRepository,
    private validator: GuestValidator,
  ) {}

  /**
   * Execute the use case
   * @param input Input parameters
   * @returns Created guest
   * @throws ValidationError if input is invalid
   * @throws OperationFailedError if guest already exists
   */
  async execute(input: CreateGuestInput): Promise<CreateGuestOutput> {
    // Step 1: Validate input
    const validationErrors = this.validator.validate(input)
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (map, error) => {
          map[error.field] = error.message
          return map
        },
        {} as Record<string, string>,
      )
      throw new ValidationError(errorMap)
    }

    // Step 2: Check if guest with email already exists
    try {
      const existingGuest = await this.guestRepository.getByEmail(input.email)
      if (existingGuest) {
        throw new OperationFailedError(
          'guest-creation',
          `Guest with email "${input.email}" already exists`,
        )
      }
    } catch (error: any) {
      // If error is not a "not found" type, re-throw
      if (error.code !== 'GUEST_NOT_FOUND') {
        throw error
      }
    }

    // Step 3: Check phone uniqueness
    try {
      const phoneGuest = await this.guestRepository.getByPhone(input.phone)
      if (phoneGuest) {
        throw new OperationFailedError(
          'guest-creation',
          `Guest with phone "${input.phone}" already exists`,
        )
      }
    } catch (error: any) {
      if (error.code !== 'GUEST_NOT_FOUND') {
        throw error
      }
    }

    // Step 4: Generate referral code
    const referralCode = this.generateReferralCode()

    // Step 5: Create guest entity
    const guest = Guest.createNew(
      this.generateGuestId(),
      input.email,
      input.phone,
      input.firstName,
      input.lastName,
      referralCode,
      input.referredBy,
    )

    // Step 6: Persist guest
    const createdGuest = await this.guestRepository.create(guest)

    // Step 7: Process referral bonus if applicable
    if (input.referredBy) {
      try {
        await this.processReferralBonus(input.referredBy, createdGuest.id)
      } catch (error) {
        // Log but don't fail the guest creation
        console.warn('Failed to process referral bonus:', error)
      }
    }

    // Step 8: Return output
    return this.mapToOutput(createdGuest)
  }

  /**
   * Process referral bonus for referrer
   */
  private async processReferralBonus(referrerId: string, newGuestId: string): Promise<void> {
    try {
      const referrer = await this.guestRepository.getById(referrerId)
      if (!referrer) {
        throw new GuestNotFoundError(referrerId)
      }

      // Update referrer with referral bonus points
      // This would normally trigger a points operation
      // For now, just track the referral
      const updatedReferrer = referrer.toDTO()
      updatedReferrer.metadata = {
        ...updatedReferrer.metadata,
        referrals: (updatedReferrer.metadata?.referrals || 0) + 1,
        lastReferralAt: new Date(),
      }

      await this.guestRepository.update(referrer.id, updatedReferrer)
    } catch (error) {
      throw error
    }
  }

  /**
   * Generate unique guest ID
   */
  private generateGuestId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `guest-${timestamp}-${random}`
  }

  /**
   * Generate referral code
   */
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `REF-${code}`
  }

  /**
   * Map entity to output DTO
   */
  private mapToOutput(guest: Guest): CreateGuestOutput {
    return {
      id: guest.id,
      email: guest.email,
      phone: guest.phone,
      firstName: guest.firstName,
      lastName: guest.lastName,
      status: guest.status,
      tier: guest.tier,
      referralCode: guest.referralCode || '',
      joinedAt: guest.joinedAt,
    }
  }
}
