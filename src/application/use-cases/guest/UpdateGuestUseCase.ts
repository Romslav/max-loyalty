/**
 * UpdateGuestUseCase
 * 
 * Use case for updating guest profile information.
 * Handles partial updates with validation and business rules.
 * Production-ready with comprehensive error handling.
 */

import { Guest } from '../../../domain/entities/guest/Guest'
import { IGuestRepository } from '../../../domain/repositories/IGuestRepository'
import { ValidationError, OperationFailedError, GuestNotFoundError } from '../../errors/PointsErrors'

/**
 * Update guest input DTO
 */
export interface UpdateGuestInput {
  guestId: string
  firstName?: string
  lastName?: string
  phone?: string
  status?: 'active' | 'inactive' | 'blocked' | 'pending_verification'
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip'
  metadata?: Record<string, any>
}

/**
 * Update guest output DTO
 */
export interface UpdateGuestOutput {
  id: string
  firstName: string
  lastName: string
  phone: string
  status: string
  tier: string
  updatedAt: Date
}

/**
 * Use case for updating guests
 */
export class UpdateGuestUseCase {
  constructor(private guestRepository: IGuestRepository) {}

  /**
   * Execute the use case
   * @param input Input parameters
   * @returns Updated guest
   * @throws GuestNotFoundError if guest doesn't exist
   * @throws ValidationError if input is invalid
   * @throws OperationFailedError if update fails
   */
  async execute(input: UpdateGuestInput): Promise<UpdateGuestOutput> {
    // Step 1: Validate input
    this.validateInput(input)

    // Step 2: Fetch existing guest
    const existingGuest = await this.guestRepository.getById(input.guestId)
    if (!existingGuest) {
      throw new GuestNotFoundError(input.guestId)
    }

    // Step 3: Check for email conflicts if updating phone
    if (input.phone && input.phone !== existingGuest.phone) {
      const phoneGuest = await this.guestRepository.getByPhone(input.phone)
      if (phoneGuest && phoneGuest.id !== input.guestId) {
        throw new OperationFailedError(
          'guest-update',
          `Phone "${input.phone}" is already in use`,
        )
      }
    }

    // Step 4: Build update object
    const updateData: Partial<any> = {}
    if (input.firstName !== undefined) updateData.firstName = input.firstName
    if (input.lastName !== undefined) updateData.lastName = input.lastName
    if (input.phone !== undefined) updateData.phone = input.phone
    if (input.status !== undefined) updateData.status = input.status
    if (input.tier !== undefined) updateData.tier = input.tier
    if (input.metadata !== undefined) updateData.metadata = input.metadata
    updateData.updatedAt = new Date()

    // Step 5: Persist update
    const updatedGuest = await this.guestRepository.update(input.guestId, updateData)

    // Step 6: Return output
    return this.mapToOutput(updatedGuest)
  }

  /**
   * Validate input
   */
  private validateInput(input: UpdateGuestInput): void {
    const errors: Record<string, string> = {}

    // Validate guest ID
    if (!input.guestId || input.guestId.trim().length === 0) {
      errors.guestId = 'Guest ID is required'
    }

    // Validate firstName if provided
    if (input.firstName !== undefined) {
      if (input.firstName.trim().length === 0) {
        errors.firstName = 'First name cannot be empty'
      } else if (input.firstName.length > 100) {
        errors.firstName = 'First name must not exceed 100 characters'
      }
    }

    // Validate lastName if provided
    if (input.lastName !== undefined) {
      if (input.lastName.trim().length === 0) {
        errors.lastName = 'Last name cannot be empty'
      } else if (input.lastName.length > 100) {
        errors.lastName = 'Last name must not exceed 100 characters'
      }
    }

    // Validate phone if provided
    if (input.phone !== undefined) {
      const digitsOnly = input.phone.replace(/\D/g, '')
      if (digitsOnly.length < 10) {
        errors.phone = 'Phone must contain at least 10 digits'
      }
    }

    // Validate status if provided
    if (input.status !== undefined) {
      const validStatuses = ['active', 'inactive', 'blocked', 'pending_verification']
      if (!validStatuses.includes(input.status)) {
        errors.status = `Status must be one of: ${validStatuses.join(', ')}`
      }
    }

    // Validate tier if provided
    if (input.tier !== undefined) {
      const validTiers = ['bronze', 'silver', 'gold', 'platinum', 'vip']
      if (!validTiers.includes(input.tier)) {
        errors.tier = `Tier must be one of: ${validTiers.join(', ')}`
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Map entity to output DTO
   */
  private mapToOutput(guest: Guest): UpdateGuestOutput {
    return {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      phone: guest.phone,
      status: guest.status,
      tier: guest.tier,
      updatedAt: guest.updatedAt,
    }
  }
}
