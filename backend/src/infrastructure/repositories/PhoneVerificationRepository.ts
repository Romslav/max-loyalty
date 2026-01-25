import { injectable } from 'inversify';
import { IPhoneVerificationRepository } from '../../domain/repositories';
import { PhoneVerificationEntity } from '../../domain/entities';

@injectable()
export class PhoneVerificationRepository implements IPhoneVerificationRepository {
  private verifications: Map<string, any> = new Map();

  async create(verification: PhoneVerificationEntity): Promise<void> {
    this.verifications.set(verification.id, {
      id: verification.id,
      phone: verification.phone,
      code: verification.code,
      attempts: verification.attempts,
      isVerified: verification.isVerified,
      verifiedAt: verification.verifiedAt,
      expiresAt: verification.expiresAt,
      createdAt: verification.createdAt,
    });
  }

  async getLatestByPhone(phone: string): Promise<PhoneVerificationEntity | null> {
    let latest: any | null = null;

    for (const [, data] of this.verifications) {
      if (data.phone === phone) {
        if (!latest || data.createdAt > latest.createdAt) {
          latest = data;
        }
      }
    }

    return latest ? this.mapToEntity(latest) : null;
  }

  async incrementAttempts(phone: string): Promise<void> {
    const existing = await this.getLatestByPhone(phone);
    if (existing) {
      const data = this.verifications.get(existing.id);
      if (data) {
        data.attempts = (data.attempts || 0) + 1;
      }
    }
  }

  async markVerified(phone: string): Promise<void> {
    const existing = await this.getLatestByPhone(phone);
    if (existing) {
      const data = this.verifications.get(existing.id);
      if (data) {
        data.isVerified = true;
        data.verifiedAt = new Date();
      }
    }
  }

  async isExpired(phone: string): Promise<boolean> {
    const existing = await this.getLatestByPhone(phone);
    if (!existing) return true;

    return existing.expiresAt < new Date();
  }

  private mapToEntity(data: any): PhoneVerificationEntity {
    return PhoneVerificationEntity.create(data);
  }
}
