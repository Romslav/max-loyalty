import 'reflect-metadata';
import { container } from '../../src/infrastructure/config/inversify.config';
import { TYPES } from '../../src/shared/types';
import { IGuestService } from '../../src/domain/services';
import { ITransactionService } from '../../src/domain/services';
import { IRestaurantService } from '../../src/domain/services';

describe('Phase 2 Integration Tests', () => {
  let guestService: IGuestService;
  let transactionService: ITransactionService;
  let restaurantService: IRestaurantService;

  beforeAll(() => {
    guestService = container.get<IGuestService>(TYPES.Services.IGuestService);
    transactionService = container.get<ITransactionService>(TYPES.Services.ITransactionService);
    restaurantService = container.get<IRestaurantService>(TYPES.Services.IRestaurantService);
  });

  describe('Guest Service', () => {
    it('should register a guest', async () => {
      const result = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(result).toHaveProperty('id');
      expect(result.phone).toContain('79991234567');
      expect(result.name).toBe('John Doe');
      expect(result.isVerified).toBe(false);
    });

    it('should send verification SMS', async () => {
      const result = await guestService.sendVerificationSMS('+79991234567');
      expect(result).toHaveProperty('attemptsLeft');
      expect(result.attemptsLeft).toBe(3);
    });

    it('should block guest', async () => {
      const guest = await guestService.registerGuest({
        phone: '+79991111111',
        name: 'Test Guest',
      });

      await guestService.blockGuest(guest.id, 'Test reason');
      const blocked = await guestService.getGuest(guest.id);

      expect(blocked.isBlocked).toBe(true);
      expect(blocked.blockReason).toBe('Test reason');
    });
  });

  describe('Restaurant Service', () => {
    it('should register restaurant', async () => {
      const result = await restaurantService.registerRestaurant({
        name: 'Test Restaurant',
        inn: '7701234567',
        address: 'Moscow, Tverskaya St',
        city: 'Moscow',
      });

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test Restaurant');
      expect(result.inn).toBe('7701234567');
    });

    it('should define tiers', async () => {
      const restaurant = await restaurantService.registerRestaurant({
        name: 'Tier Test Restaurant',
        inn: '7709999999',
        address: 'St Petersburg',
        city: 'SPB',
      });

      await restaurantService.defineTiers({
        restaurantId: restaurant.id,
        tiersConfig: [
          { name: 'BRONZE', discountPercent: 5, minPoints: 0, maxPoints: 1000 },
          { name: 'SILVER', discountPercent: 10, minPoints: 1000, maxPoints: 5000 },
        ],
      });

      const restaurant2 = await restaurantService.getRestaurant(restaurant.id);
      expect(restaurant2).toHaveProperty('id');
    });
  });

  describe('Full Journey', () => {
    it('should complete full transaction flow', async () => {
      // Register guest
      const guest = await guestService.registerGuest({
        phone: '+79992223344',
        name: 'Alice',
      });

      console.log('Guest registered:', guest.id);
      expect(guest.id).toBeDefined();

      // Register restaurant
      const restaurant = await restaurantService.registerRestaurant({
        name: 'Test Cafe',
        inn: '7712345678',
        address: 'Cafe Street',
        city: 'Moscow',
      });

      console.log('Restaurant registered:', restaurant.id);
      expect(restaurant.id).toBeDefined();

      // Define tiers
      await restaurantService.defineTiers({
        restaurantId: restaurant.id,
        tiersConfig: [
          { name: 'BRONZE', discountPercent: 5, minPoints: 0, maxPoints: 10000 },
        ],
      });

      console.log('Tiers defined');
    });
  });
});
