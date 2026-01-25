// Application Layer - Register Guest Use Case
// Orchestrates guest registration flow across domain services

import { IGuestService } from '../../domain/services/GuestService';
import { IGuestRestaurantRepository } from '../../domain/repositories';
import { GuestEntity } from '../../domain/entities';

export class RegisterGuestUseCase {
  constructor(
    private readonly guestService: IGuestService,
    private readonly guestRestaurantRepo: IGuestRestaurantRepository,
  ) {}

  async execute(input: RegisterGuestInput): Promise<RegisterGuestOutput> {
    // Step 1: Validate phone format
    if (!this.isValidPhone(input.phone)) {
      throw new Error('Invalid phone number format');
    }

    // Step 2: Check if guest already exists
    const existingGuest = await this.guestService.getGuestByPhone(input.phone);
    if (existingGuest && existingGuest.isVerified) {
      throw new Error('Phone number already registered');
    }

    // Step 3: Register or update guest
    let guest: GuestEntity;
    if (existingGuest) {
      // Update existing unverified guest
      guest = existingGuest;
    } else {
      // Create new guest
      guest = await this.guestService.registerGuest({
        phone: input.phone,
        name: input.name,
        email: input.email,
        dateOfBirth: input.dateOfBirth,
        source: input.source,
        telegramId: input.telegramId,
      });
    }

    // Step 4: Register guest in restaurant if specified
    if (input.restaurantId) {
      const guestRestaurant = await this.guestService.registerGuestInRestaurant(
        guest.id,
        input.restaurantId,
      );

      return {
        guestId: guest.id,
        guestRestaurantId: guestRestaurant.id,
        phone: guest.phone,
        isVerified: guest.isVerified,
        restaurantId: input.restaurantId,
      };
    }

    return {
      guestId: guest.id,
      phone: guest.phone,
      isVerified: guest.isVerified,
    };
  }

  private isValidPhone(phone: string): boolean {
    // Russian phone format validation: +7 or 8 followed by 10 digits
    const phoneRegex = /^(?:\+7|8)[\d]{10}$/;
    return phoneRegex.test(phone.replace(/[^\d+]/g, ''));
  }
}

export interface RegisterGuestInput {
  phone: string;
  name: string;
  email?: string;
  dateOfBirth?: Date;
  restaurantId?: string;
  source: 'telegram' | 'web' | 'qr' | 'sms';
  telegramId?: string;
}

export interface RegisterGuestOutput {
  guestId: string;
  guestRestaurantId?: string;
  phone: string;
  isVerified: boolean;
  restaurantId?: string;
}
