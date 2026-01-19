import Dexie, { Table } from 'dexie'
import { Guest, LoyaltyCard, Operation } from '@types/index'

export class MaxLoyaltyDB extends Dexie {
  guests!: Table<Guest>
  cards!: Table<LoyaltyCard>
  operations!: Table<Operation>
  restaurants!: Table<any>
  family!: Table<any>

  constructor() {
    super('MaxLoyaltyDB')
    this.version(1).stores({
      guests: 'phone',
      cards: 'id, restaurantId, guestPhone',
      operations: 'id, cardId, timestamp',
      restaurants: 'id',
      family: 'id, guestPhone',
    })
  }
}

export const db = new MaxLoyaltyDB()

// Helper functions
export async function cacheGuest(guest: Guest) {
  await db.guests.put(guest)
}

export async function cacheCard(card: LoyaltyCard) {
  await db.cards.put(card)
}

export async function cacheOperation(operation: Operation) {
  await db.operations.put(operation)
}

export async function getGuestByPhone(phone: string) {
  return db.guests.get(phone)
}

export async function getCardByNumber(cardNumber: string) {
  return db.cards.where('cardNumber').equals(cardNumber).first()
}

export async function getPendingOperations() {
  return db.operations.where('syncStatus').equals('pending').toArray()
}

export async function clearAllCache() {
  await db.guests.clear()
  await db.cards.clear()
  await db.operations.clear()
  await db.restaurants.clear()
  await db.family.clear()
}
