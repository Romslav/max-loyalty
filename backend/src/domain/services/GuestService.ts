export interface IGuest {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  isBlocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVerificationResult {
  verified: boolean;
  message?: string;
}

export interface IGuestService {
  registerGuest(input: { phone: string; name: string; email?: string }): Promise<IGuest>;
  verifyPhone(guestId: string, code: string): Promise<IVerificationResult>;
  getGuest(guestId: string): Promise<IGuest>;
  getByPhone(phone: string): Promise<IGuest | null>;
  blockGuest(guestId: string, reason: string): Promise<void>;
  unblockGuest(guestId: string): Promise<void>;
  updateGuestInfo(guestId: string, updates: Partial<IGuest>): Promise<void>;
  sendVerificationSMS(phone: string): Promise<{ attemptsLeft: number }>;
  getVerificationAttempts(phone: string): Promise<number>;
}
