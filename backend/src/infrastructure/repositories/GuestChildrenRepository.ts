import { injectable } from 'inversify';
import { IGuestChildrenRepository } from '../../domain/repositories';
import { GuestChildEntity } from '../../domain/entities';

@injectable()
export class GuestChildrenRepository implements IGuestChildrenRepository {
  private children: Map<string, GuestChildEntity> = new Map();

  async create(child: GuestChildEntity): Promise<void> {
    this.children.set(child.id, child);
  }

  async getById(id: string): Promise<GuestChildEntity | null> {
    return this.children.get(id) || null;
  }

  async getByGuestId(guestId: string): Promise<GuestChildEntity[]> {
    const results: GuestChildEntity[] = [];

    for (const [, child] of this.children) {
      if (child.guestId === guestId) {
        results.push(child);
      }
    }

    return results.sort((a, b) => a.dateOfBirth.getTime() - b.dateOfBirth.getTime());
  }

  async update(id: string, updates: Partial<GuestChildEntity>): Promise<void> {
    const existing = this.children.get(id);
    if (existing) {
      Object.assign(existing, updates);
    }
  }

  async delete(id: string): Promise<void> {
    this.children.delete(id);
  }

  async countByGuest(guestId: string): Promise<number> {
    let count = 0;

    for (const [, child] of this.children) {
      if (child.guestId === guestId) {
        count++;
      }
    }

    return count;
  }
}
