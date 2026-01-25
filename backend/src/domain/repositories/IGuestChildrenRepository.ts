import { GuestChildEntity } from '../entities';

export interface IGuestChildrenRepository {
  create(child: GuestChildEntity): Promise<void>;
  getById(id: string): Promise<GuestChildEntity | null>;
  getByGuestId(guestId: string): Promise<GuestChildEntity[]>;
  update(id: string, updates: Partial<GuestChildEntity>): Promise<void>;
  delete(id: string): Promise<void>;
  countByGuest(guestId: string): Promise<number>;
}
