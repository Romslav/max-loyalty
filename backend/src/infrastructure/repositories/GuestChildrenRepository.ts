import { injectable } from 'inversify';
import { IGuestChildrenRepository } from '../../domain/repositories';
import { GuestChildEntity } from '../../domain/entities';

@injectable()
export class GuestChildrenRepository implements IGuestChildrenRepository {
  private children: Map<string, any> = new Map();

  async create(child: GuestChildEntity): Promise<void> {
    this.children.set(child.id, {
      id: child.id,
      guestId: child.guestId,
      name: child.name,
      dateOfBirth: child.dateOfBirth,
      createdAt: child.createdAt,
    });
  }

  async getById(id: string): Promise<GuestChildEntity | null> {
    const data = this.children.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByGuestId(guestId: string): Promise<GuestChildEntity[]> {
    const results: GuestChildEntity[] = [];

    for (const [, data] of this.children) {
      if (data.guestId === guestId) {
        results.push(this.mapToEntity(data));
      }
    }

    return results;
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

    for (const [, data] of this.children) {
      if (data.guestId === guestId) {
        count++;
      }
    }

    return count;
  }

  private mapToEntity(data: any): GuestChildEntity {
    return GuestChildEntity.create(data);
  }
}
