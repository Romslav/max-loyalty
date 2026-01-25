export class PhoneVerificationEntity {
  id: string;
  phone: string;
  code: string;
  attempts: number;
  isVerified: boolean;
  verifiedAt?: Date;
  expiresAt: Date;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.phone = data.phone;
    this.code = data.code;
    this.attempts = data.attempts || 0;
    this.isVerified = data.isVerified || false;
    this.verifiedAt = data.verifiedAt;
    this.expiresAt = data.expiresAt;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): PhoneVerificationEntity {
    return new PhoneVerificationEntity(data);
  }
}
