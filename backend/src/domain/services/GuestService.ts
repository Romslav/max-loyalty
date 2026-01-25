// Domain Service Interface - Guest Management
// Defines contract for guest registration, verification, and profile management

export interface IGuestService {
  // Registration flow
  registerGuest(data: RegisterGuestDTO): Promise<Guest>;
  verifyPhoneNumber(phone: string, code: string): Promise<boolean>;
  sendVerificationCode(phone: string): Promise<void>;
  
  // Guest retrieval
  getGuestByPhone(phone: string): Promise<Guest | null>;
  getGuestById(id: string): Promise<Guest | null>;
  getGuestByTelegramId(telegramId: string): Promise<Guest | null>;
  
  // Profile management
  updateGuestProfile(id: string, data: UpdateGuestDTO): Promise<Guest>;
  addChildProfile(guestId: string, data: AddChildDTO): Promise<void>;
  removeChildProfile(childId: string): Promise<void>;
  
  // Guest-Restaurant relationship
  registerGuestInRestaurant(guestId: string, restaurantId: string): Promise<GuestRestaurant>;
  getGuestRestaurantData(guestId: string, restaurantId: string): Promise<GuestRestaurant | null>;
}

export interface RegisterGuestDTO {
  phone: string;
  name: string;
  email?: string;
  dateOfBirth?: Date;
  source: 'telegram' | 'web' | 'qr' | 'sms';
  telegramId?: string;
}

export interface UpdateGuestDTO {
  name?: string;
  email?: string;
  dateOfBirth?: Date;
  language?: string;
}

export interface AddChildDTO {
  name: string;
  dateOfBirth: Date;
  gender?: 'M' | 'F' | 'OTHER';
  allergies?: string;
  preferences?: Record<string, any>;
}

export interface Guest {
  id: string;
  phone: string;
  name: string;
  email?: string;
  dateOfBirth?: Date;
  telegramId?: string;
  source: string;
  isVerified: boolean;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestRestaurant {
  id: string;
  guestId: string;
  restaurantId: string;
  balancePoints: number;
  tier: string;
  visitsCount: number;
  totalSpentRubles: number;
  lastVisitAt?: Date;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: Date;
}
