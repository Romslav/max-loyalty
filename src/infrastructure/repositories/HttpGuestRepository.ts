/**
 * HttpGuestRepository - реализация репозитория для клиентов
 */

import type { IGuestRepository } from '../../domain/repositories';
import type { Guest, GuestStatistics, CreateGuestInput, UpdateGuestInput, GuestFilters } from '../../domain/entities';
import { httpClient } from '../http/HttpClient';
import type { GuestDto, GuestStatisticsDto, GuestsListResponseDto } from '../dtos';

const API_ENDPOINT = '/guests';

export class HttpGuestRepository implements IGuestRepository {
  async findById(id: string): Promise<Guest | null> {
    try {
      const dto = await httpClient.get<GuestDto>(`${API_ENDPOINT}/${id}`);
      return this.dtoToEntity(dto);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<Guest | null> {
    try {
      const dto = await httpClient.get<GuestDto>(`${API_ENDPOINT}/email/${email}`);
      return this.dtoToEntity(dto);
    } catch (error) {
      return null;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Guest | null> {
    try {
      const dto = await httpClient.get<GuestDto>(`${API_ENDPOINT}/phone/${phoneNumber}`);
      return this.dtoToEntity(dto);
    } catch (error) {
      return null;
    }
  }

  async findAll(filters?: GuestFilters): Promise<Guest[]> {
    const response = await httpClient.get<GuestsListResponseDto>(API_ENDPOINT, {
      params: filters,
    });
    return response.guests.map((dto) => this.dtoToEntity(dto));
  }

  async count(filters?: GuestFilters): Promise<number> {
    const response = await httpClient.get<{ count: number }>(`${API_ENDPOINT}/count`, {
      params: filters,
    });
    return response.count;
  }

  async create(input: CreateGuestInput): Promise<Guest> {
    const dto = await httpClient.post<GuestDto>(API_ENDPOINT, input);
    return this.dtoToEntity(dto);
  }

  async update(id: string, input: UpdateGuestInput): Promise<Guest> {
    const dto = await httpClient.put<GuestDto>(`${API_ENDPOINT}/${id}`, input);
    return this.dtoToEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${API_ENDPOINT}/${id}`);
  }

  async findByRestaurantId(restaurantId: string, filters?: GuestFilters): Promise<Guest[]> {
    const response = await httpClient.get<GuestsListResponseDto>(
      `${API_ENDPOINT}/restaurant/${restaurantId}`,
      { params: filters }
    );
    return response.guests.map((dto) => this.dtoToEntity(dto));
  }

  async getStatistics(guestId: string): Promise<GuestStatistics | null> {
    try {
      const dto = await httpClient.get<GuestStatisticsDto>(`${API_ENDPOINT}/${guestId}/statistics`);
      return this.dtoStatsToEntity(dto);
    } catch (error) {
      return null;
    }
  }

  private dtoToEntity(dto: GuestDto): Guest {
    return {
      id: dto.id,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      totalPoints: dto.totalPoints,
      joinedAt: new Date(dto.joinedAt),
      lastVisitAt: dto.lastVisitAt ? new Date(dto.lastVisitAt) : undefined,
      isActive: dto.isActive,
      restaurantIds: dto.restaurantIds,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  private dtoStatsToEntity(dto: GuestStatisticsDto): GuestStatistics {
    return {
      totalVisits: dto.totalVisits,
      totalSpent: dto.totalSpent,
      averageSpend: dto.averageSpend,
      pointsRedeemed: dto.pointsRedeemed,
      pointsAvailable: dto.pointsAvailable,
      lastVisitDate: dto.lastVisitDate ? new Date(dto.lastVisitDate) : undefined,
    };
  }
}
