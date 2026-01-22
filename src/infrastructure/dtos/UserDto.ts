/**
 * UserDto - Data Transfer Objects для клиентов
 */

import type { User, UserRole } from '../../domain/entities';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequestDto {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  restaurantId?: string;
}

export interface UpdateUserRequestDto {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  restaurantId?: string;
}

export interface UsersListResponseDto {
  users: UserDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function mapUserToDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    restaurantId: user.restaurantId,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
