/**
 * GuestDto - Data Transfer Objects для клиентов
 */

import type { Guest, GuestStatistics } from '../../domain/entities';

export interface GuestDto {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  totalPoints: number;
  joinedAt: string;
  lastVisitAt?: string;
  lastOperationAt?: string;
  isActive: boolean;
  restaurantIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GuestStatisticsDto {
  totalVisits: number;
  totalSpent: number;
  averageSpend: number;
  pointsRedeemed: number;
  pointsAvailable: number;
  lastVisitDate?: string;
  favoriteRestaurant?: string;
}

export interface GuestWithStatisticsDto extends GuestDto {
  statistics: GuestStatisticsDto;
}

export interface CreateGuestRequestDto {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  restaurantId: string;
  initialPoints?: number;
}

export interface UpdateGuestRequestDto {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface GuestsListResponseDto {
  guests: GuestDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function mapGuestToDto(guest: Guest): GuestDto {
  return {
    id: guest.id,
    email: guest.email,
    phoneNumber: guest.phoneNumber,
    firstName: guest.firstName,
    lastName: guest.lastName,
    totalPoints: guest.totalPoints,
    joinedAt: guest.joinedAt.toISOString(),
    lastVisitAt: guest.lastVisitAt?.toISOString(),
    lastOperationAt: guest.lastOperationAt?.toISOString(),
    isActive: guest.isActive,
    restaurantIds: guest.restaurantIds,
    createdAt: guest.createdAt.toISOString(),
    updatedAt: guest.updatedAt.toISOString(),
  };
}

export function mapGuestStatisticsToDto(stats: GuestStatistics): GuestStatisticsDto {
  return {
    totalVisits: stats.totalVisits,
    totalSpent: stats.totalSpent,
    averageSpend: stats.averageSpend,
    pointsRedeemed: stats.pointsRedeemed,
    pointsAvailable: stats.pointsAvailable,
    lastVisitDate: stats.lastVisitDate?.toISOString(),
    favoriteRestaurant: stats.favoriteRestaurant,
  };
}
