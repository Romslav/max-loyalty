import { GuestEntity } from '../entities';

export interface IGuestRepository {
  create(guest: GuestEntity): Promise<void>;
  getById(guestId: string): Promise<GuestEntity | null>;
  getByPhone(phone: string): Promise<GuestEntity | null>;
  update(guestId: string, updates: Partial<GuestEntity>): Promise<void>;
  delete(guestId: string): Promise<void>;
  search(filters: any): Promise<GuestEntity[]>;
}
