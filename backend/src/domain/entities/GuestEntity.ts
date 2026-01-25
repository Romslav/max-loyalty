export class GuestEntity {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  isBlocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.phone = data.phone;
    this.name = data.name;
    this.email = data.email;
    this.isVerified = data.isVerified || false;
    this.isBlocked = data.isBlocked || false;
    this.blockReason = data.blockReason;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static create(data: any): GuestEntity {
    return new GuestEntity(data);
  }

  block(reason: string): void {
    this.isBlocked = true;
    this.blockReason = reason;
    this.updatedAt = new Date();
  }

  unblock(): void {
    this.isBlocked = false;
    this.blockReason = undefined;
    this.updatedAt = new Date();
  }

  verify(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }
}
