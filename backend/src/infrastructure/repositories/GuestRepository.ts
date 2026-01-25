import { injectable } from 'inversify';
import { IGuestRepository } from '../../domain/repositories';
import { GuestEntity } from '../../domain/entities';

@injectable()
export class GuestRepository implements IGuestRepository {
  private guests: Map<string, GuestEntity> = new Map();

  async create(guest: GuestEntity): Promise<void> {
    this.guests.set(guest.id, guest);
  }

  async getById(guestId: string): Promise<GuestEntity | null> {
    return this.guests.get(guestId) || null;
  }

  async getByPhone(phone: string): Promise<GuestEntity | null> {
    for (const [, guest] of this.guests) {
      if (guest.phone === phone) {
        return guest;
      }
    }
    return null;
  }

  async update(guestId: string, updates: Partial<GuestEntity>): Promise<void> {
    const existing = this.guests.get(guestId);
    if (existing) {
      Object.assign(existing, updates);
    }
  }

  async delete(guestId: string): Promise<void> {
    this.guests.delete(guestId);
  }

  async search(filters: any): Promise<GuestEntity[]> {
    const results: GuestEntity[] = [];

    for (const [, guest] of this.guests) {
      if (filters.phone && !guest.phone.includes(filters.phone)) continue;
      if (filters.name && !guest.name.includes(filters.name)) continue;
      if (filters.isBlocked !== undefined && guest.isBlocked !== filters.isBlocked) continue;

      results.push(guest);

      if (filters.limit && results.length >= filters.limit) break;
    }

    return results;
  }
}
