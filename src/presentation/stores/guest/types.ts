/**
 * Guest Store Types
 */

import type { Guest, GuestStatistics } from '@/domain/entities';

export interface GuestState {
  guests: Guest[];
  currentGuest: Guest | null;
  selectedGuest: Guest | null;
  statistics: GuestStatistics | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateGuestRequest {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  restaurantId: string;
  initialPoints?: number;
}
