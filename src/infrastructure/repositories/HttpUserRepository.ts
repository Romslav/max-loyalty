/**
 * HttpUserRepository - реализация репозитория для пользователей
 */

import type { IUserRepository } from '../../domain/repositories';
import type { User, CreateUserInput, UpdateUserInput, UserFilters } from '../../domain/entities';
import { httpClient } from '../http/HttpClient';
import type { UserDto, UsersListResponseDto } from '../dtos';

const API_ENDPOINT = '/users';

export class HttpUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const dto = await httpClient.get<UserDto>(`${API_ENDPOINT}/${id}`);
      return dto ? this.dtoToEntity(dto) : null;
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const dto = await httpClient.get<UserDto>(`${API_ENDPOINT}/email/${email}`);
      return dto ? this.dtoToEntity(dto) : null;
    } catch (error) {
      return null;
    }
  }

  async findAll(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.search) params.append('search', filters.search);
    }

    const response = await httpClient.get<UsersListResponseDto>(
      `${API_ENDPOINT}?${params.toString()}`
    );
    return response.users.map((dto) => this.dtoToEntity(dto));
  }

  async count(filters?: UserFilters): Promise<number> {
    const response = await httpClient.get<{ count: number }>(`${API_ENDPOINT}/count`, {
      params: filters,
    });
    return response.count;
  }

  async create(input: CreateUserInput): Promise<User> {
    const dto = await httpClient.post<UserDto>(API_ENDPOINT, input);
    return this.dtoToEntity(dto);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const dto = await httpClient.put<UserDto>(`${API_ENDPOINT}/${id}`, input);
    return this.dtoToEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${API_ENDPOINT}/${id}`);
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const response = await httpClient.get<{ exists: boolean }>(
        `${API_ENDPOINT}/exists/email/${email}`
      );
      return response.exists;
    } catch (error) {
      return false;
    }
  }

  private dtoToEntity(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      role: dto.role,
      restaurantId: dto.restaurantId,
      isActive: dto.isActive,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }
}
