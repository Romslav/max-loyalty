import { PhoneVerificationEntity } from '../entities';

export interface IPhoneVerificationRepository {
  create(verification: PhoneVerificationEntity): Promise<void>;
  getLatestByPhone(phone: string): Promise<PhoneVerificationEntity | null>;
  incrementAttempts(phone: string): Promise<void>;
  markVerified(phone: string): Promise<void>;
  isExpired(phone: string): Promise<boolean>;
}
