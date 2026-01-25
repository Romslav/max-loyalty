import { injectable } from 'inversify';
import { IPhoneVerificationRepository } from '../../domain/repositories';
import { PhoneVerificationEntity } from '../../domain/entities';

@injectable()
export class PhoneVerificationRepository implements IPhoneVerificationRepository {
  private verifications: Map<string, PhoneVerificationEntity> = new Map();

  async create(verification: PhoneVerificationEntity): Promise<void> {
    this.verifications.set(verification.id, verification);
  }

  async getLatestByPhone(phone: string): Promise<PhoneVerificationEntity | null> {
    let latest: PhoneVerificationEntity | null = null;

    for (const [, verification] of this.verifications) {
      if (verification.phone === phone) {
        if (!latest || verification.createdAt > latest.createdAt) {
          latest = verification;
        }
      }
    }

    return latest;
  }

  async incrementAttempts(phone: string): Promise<void> {
    const latest = await this.getLatestByPhone(phone);
    if (latest) {
      latest.attempts++;
    }
  }

  async markVerified(phone: string): Promise<void> {
    const latest = await this.getLatestByPhone(phone);
    if (latest) {
      latest.isVerified = true;
      latest.verifiedAt = new Date();
    }
  }

  async isExpired(phone: string): Promise<boolean> {
    const latest = await this.getLatestByPhone(phone);
    if (!latest) return true;
    return new Date() > latest.expiresAt;
  }
}
