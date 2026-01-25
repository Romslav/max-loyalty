import { injectable, inject } from 'inversify';
import { IGuestService } from '../../domain/services';
import { IGuestRepository, IPhoneVerificationRepository } from '../../domain/repositories';
import { TYPES } from '../../shared/types';
import { GuestEntity, PhoneVerificationEntity } from '../../domain/entities';
import { ErrorCode } from '../../shared/types';

@injectable()
export class GuestServiceImpl implements IGuestService {
  constructor(
    @inject(TYPES.Repositories.IGuestRepository)
    private guestRepository: IGuestRepository,

    @inject(TYPES.Repositories.IPhoneVerificationRepository)
    private phoneVerificationRepository: IPhoneVerificationRepository,
  ) {}

  async registerGuest(input: { phone: string; name: string; email?: string }): Promise<any> {
    this.validatePhoneFormat(input.phone);

    const normalized = this.normalizePhone(input.phone);
    const existing = await this.guestRepository.getByPhone(normalized);

    if (existing) {
      throw {
        code: ErrorCode.GUEST_ALREADY_EXISTS,
        message: `Guest with phone ${normalized} already exists`,
      };
    }

    const guest = GuestEntity.create({
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      phone: normalized,
      name: input.name.trim(),
      email: input.email?.trim(),
      isVerified: false,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.guestRepository.create(guest);
    console.log(`✅ Guest registered: ${guest.id}`);

    return guest;
  }

  async verifyPhone(guestId: string, code: string): Promise<{ verified: boolean; message?: string }> {
    const guest = await this.guestRepository.getById(guestId);

    if (!guest) {
      throw {
        code: ErrorCode.GUEST_NOT_FOUND,
        message: `Guest ${guestId} not found`,
      };
    }

    const verification = await this.phoneVerificationRepository.getLatestByPhone(guest.phone);

    if (!verification) {
      throw {
        code: ErrorCode.PHONE_VERIFICATION_FAILED,
        message: 'No verification code found',
      };
    }

    const isExpired = await this.phoneVerificationRepository.isExpired(guest.phone);
    if (isExpired) {
      throw {
        code: ErrorCode.PHONE_VERIFICATION_EXPIRED,
        message: 'Verification code expired',
      };
    }

    if (verification.code !== code) {
      await this.phoneVerificationRepository.incrementAttempts(guest.phone);
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid verification code',
      };
    }

    guest.verify();
    await this.guestRepository.update(guestId, guest);
    await this.phoneVerificationRepository.markVerified(guest.phone);

    console.log(`✅ Phone verified: ${guest.phone}`);

    return { verified: true };
  }

  async getGuest(guestId: string): Promise<any> {
    const guest = await this.guestRepository.getById(guestId);

    if (!guest) {
      throw {
        code: ErrorCode.GUEST_NOT_FOUND,
        message: `Guest ${guestId} not found`,
      };
    }

    return guest;
  }

  async getByPhone(phone: string): Promise<any | null> {
    const normalized = this.normalizePhone(phone);
    return this.guestRepository.getByPhone(normalized);
  }

  async blockGuest(guestId: string, reason: string): Promise<void> {
    const guest = await this.getGuest(guestId);
    guest.block(reason);
    await this.guestRepository.update(guestId, guest);
    console.log(`🔒 Guest blocked: ${guestId}`);
  }

  async unblockGuest(guestId: string): Promise<void> {
    const guest = await this.getGuest(guestId);
    guest.unblock();
    await this.guestRepository.update(guestId, guest);
    console.log(`🔓 Guest unblocked: ${guestId}`);
  }

  async updateGuestInfo(guestId: string, updates: Partial<any>): Promise<void> {
    const guest = await this.getGuest(guestId);
    Object.assign(guest, updates);
    await this.guestRepository.update(guestId, guest);
    console.log(`✏️  Guest info updated: ${guestId}`);
  }

  async sendVerificationSMS(phone: string): Promise<{ attemptsLeft: number }> {
    const normalized = this.normalizePhone(phone);

    const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const verification = PhoneVerificationEntity.create({
      id: `pv-${Date.now()}`,
      phone: normalized,
      code,
      attempts: 0,
      isVerified: false,
      expiresAt,
      createdAt: new Date(),
    });

    await this.phoneVerificationRepository.create(verification);

    // TODO: Send actual SMS via gateway
    console.log(`📱 SMS sent to ${normalized}: ${code}`);

    return { attemptsLeft: 3 };
  }

  async getVerificationAttempts(phone: string): Promise<number> {
    const normalized = this.normalizePhone(phone);
    const verification = await this.phoneVerificationRepository.getLatestByPhone(normalized);
    return verification ? verification.attempts : 0;
  }

  private validatePhoneFormat(phone: string): void {
    const phoneRegex = /^[\d\s+\-()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid phone format',
      };
    }
  }

  private normalizePhone(phone: string): string {
    let normalized = phone.replace(/[^\d]/g, '');
    if (!normalized.startsWith('7')) {
      normalized = '7' + normalized;
    }
    return '+' + normalized;
  }
}
