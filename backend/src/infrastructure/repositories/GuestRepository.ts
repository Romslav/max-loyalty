import { injectable, inject } from 'inversify';
import { IGuestRepository } from '../../domain/repositories';
import { GuestEntity } from '../../domain/entities';
import { TYPES } from '../../shared/types';

interface SearchGuestFilters {
  phone?: string;
  name?: string;
  isBlocked?: boolean;
  limit?: number;
}

@injectable()
export class GuestRepository implements IGuestRepository {
  private guests: Map<string, any> = new Map();

  async create(guest: GuestEntity): Promise<void> {
    this.guests.set(guest.id, {
      id: guest.id,
      phone: guest.phone,
      name: guest.name,
      email: guest.email,
      isVerified: guest.isVerified,
      isBlocked: guest.isBlocked,
      blockReason: guest.blockReason,
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    });
  }

  async getById(guestId: string): Promise<GuestEntity | null> {
    const data = this.guests.get(guestId);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByPhone(phone: string): Promise<GuestEntity | null> {
    for (const [, data] of this.guests) {
      if (data.phone === phone) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async update(guestId: string, updates: Partial<GuestEntity>): Promise<void> {
    const existing = this.guests.get(guestId);
    if (!existing) return;

    this.guests.set(guestId, {
      ...existing,
      ...updates,
      id: guestId,
      updatedAt: new Date(),
    });
  }

  async delete(guestId: string): Promise<void> {
    this.guests.delete(guestId);
  }

  async search(filters: SearchGuestFilters): Promise<GuestEntity[]> {
    const results: GuestEntity[] = [];

    for (const [, data] of this.guests) {
      if (filters.phone && !data.phone.includes(filters.phone)) continue;
      if (filters.name && !data.name.includes(filters.name)) continue;
      if (filters.isBlocked !== undefined && data.isBlocked !== filters.isBlocked) continue;

      results.push(this.mapToEntity(data));

      if (filters.limit && results.length >= filters.limit) break;
    }

    return results;
  }

  private mapToEntity(data: any): GuestEntity {
    return GuestEntity.create(data);
  }
}

export { SearchGuestFilters };
