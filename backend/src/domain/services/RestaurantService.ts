// Domain Service Interface - Restaurant & Business Management
// Handles restaurant network, points of sale, customization, and tiers

export interface IRestaurantService {
  // Restaurant CRUD
  createRestaurant(data: CreateRestaurantDTO): Promise<Restaurant>;
  getRestaurant(id: string): Promise<Restaurant | null>;
  updateRestaurant(id: string, data: UpdateRestaurantDTO): Promise<Restaurant>;
  listRestaurantsByOwner(ownerId: string): Promise<Restaurant[]>;
  
  // Points of Sale
  createPointOfSale(restaurantId: string, data: CreatePOSDTO): Promise<PointOfSale>;
  getPointOfSale(id: string): Promise<PointOfSale | null>;
  listPointsOfSale(restaurantId: string): Promise<PointOfSale[]>;
  updatePointOfSale(id: string, data: UpdatePOSDTO): Promise<PointOfSale>;
  
  // Loyalty Customization
  getCustomization(restaurantId: string): Promise<LoyaltyCustomization | null>;
  updateCustomization(restaurantId: string, data: UpdateCustomizationDTO): Promise<LoyaltyCustomization>;
  
  // Tier Management
  getTierDefinitions(restaurantId: string): Promise<TierDefinition[]>;
  createTierDefinition(restaurantId: string, data: CreateTierDTO): Promise<TierDefinition>;
  updateTierDefinition(tierId: string, data: UpdateTierDTO): Promise<TierDefinition>;
  getTierByPoints(restaurantId: string, points: number): Promise<TierDefinition | null>;
  
  // Staff Management
  assignStaffToRestaurant(restaurantId: string, data: AssignStaffDTO): Promise<void>;
  removeStaffFromRestaurant(restaurantId: string, userId: string): Promise<void>;
  listRestaurantStaff(restaurantId: string): Promise<StaffAssignment[]>;
  
  // Analytics & Reporting
  getRestaurantStats(restaurantId: string, period?: DateRange): Promise<RestaurantStats>;
  getTopGuests(restaurantId: string, limit?: number): Promise<GuestRanking[]>;
}

export interface CreateRestaurantDTO {
  ownerId: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  systemType: 'DISCOUNT' | 'ACCUMULATION';
  subscriptionTier: 'FREE' | 'CUSTOM' | 'STANDARD' | 'PRO' | 'ULTIMA';
}

export interface UpdateRestaurantDTO {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status?: 'ACTIVE' | 'FROZEN' | 'BLOCKED';
  subscriptionTier?: 'FREE' | 'CUSTOM' | 'STANDARD' | 'PRO' | 'ULTIMA';
}

export interface CreatePOSDTO {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  establishmentType?: string;
  openingHours?: Record<string, any>;
  capacity?: number;
}

export interface UpdatePOSDTO {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateCustomizationDTO {
  minPurchaseAmount?: number;
  pointsExpirationDays?: number;
  bonusCalculationFormula?: string;
  cardDesignTemplate?: string;
  colors?: Record<string, string>;
  telegramBotEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
}

export interface CreateTierDTO {
  tierName: string;
  tierLevel: number;
  minPoints: number;
  maxPoints?: number;
  discountPercent: number;
  tierColor: string;
  tierIcon?: string;
  privileges?: Record<string, any>;
}

export interface UpdateTierDTO {
  tierName?: string;
  minPoints?: number;
  maxPoints?: number;
  discountPercent?: number;
  tierColor?: string;
  tierIcon?: string;
  privileges?: Record<string, any>;
}

export interface AssignStaffDTO {
  userId: string;
  role: 'MANAGER' | 'CASHIER';
  permissions?: Record<string, boolean>;
  expiresAt?: Date;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  systemType: string;
  subscriptionTier: string;
  status: string;
  guestCount: number;
  posCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointOfSale {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface LoyaltyCustomization {
  id: string;
  restaurantId: string;
  minPurchaseAmount: number;
  pointsExpirationDays: number;
  bonusCalculationFormula?: string;
  cardDesignTemplate?: string;
  colors?: Record<string, string>;
  telegramBotEnabled: boolean;
  smsNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

export interface TierDefinition {
  id: string;
  restaurantId: string;
  tierName: string;
  tierLevel: number;
  minPoints: number;
  maxPoints?: number;
  discountPercent: number;
  tierColor: string;
  tierIcon?: string;
  privileges?: Record<string, any>;
}

export interface StaffAssignment {
  id: string;
  userId: string;
  role: string;
  permissions?: Record<string, boolean>;
  assignedAt: Date;
  expiresAt?: Date;
}

export interface RestaurantStats {
  totalGuests: number;
  activeGuests: number;
  totalRevenueRubles: number;
  totalPointsAwarded: number;
  totalPointsRedeemed: number;
  averageOrderValue: number;
  visitFrequency: number;
}

export interface GuestRanking {
  guestId: string;
  name: string;
  tier: string;
  totalSpent: number;
  visitCount: number;
  balance: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
