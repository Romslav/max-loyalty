import { GuestServiceImpl } from '../../infrastructure/services/GuestServiceImpl';
import { GuestRepository } from '../../infrastructure/repositories/GuestRepository';
import { PhoneVerificationRepository } from '../../infrastructure/repositories/PhoneVerificationRepository';
import { ErrorCode } from '../../shared/types';

describe('GuestServiceImpl', () => {
  let guestService: GuestServiceImpl;
  let guestRepository: GuestRepository;
  let phoneVerificationRepository: PhoneVerificationRepository;

  beforeEach(() => {
    guestRepository = new GuestRepository();
    phoneVerificationRepository = new PhoneVerificationRepository();
    guestService = new GuestServiceImpl(
      guestRepository,
      phoneVerificationRepository,
    );
  });

  describe('registerGuest', () => {
    it('should register guest with valid phone', async () => {
      const result = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'John Doe',
      });

      expect(result.id).toBeDefined();
      expect(result.phone).toBe('+79991234567');
      expect(result.name).toBe('John Doe');
      expect(result.isVerified).toBe(false);
    });

    it('should normalize phone number', async () => {
      const result = await guestService.registerGuest({
        phone: '79991234567',
        name: 'Test',
      });

      expect(result.phone).toMatch(/^\+7/);
    });

    it('should throw error for invalid phone', async () => {
      try {
        await guestService.registerGuest({
          phone: 'invalid',
          name: 'Test',
        });
        fail('Should throw error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      }
    });

    it('should throw error for duplicate phone', async () => {
      await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      try {
        await guestService.registerGuest({
          phone: '+79991234567',
          name: 'Other',
        });
        fail('Should throw error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.GUEST_ALREADY_EXISTS);
      }
    });
  });

  describe('verifyPhone', () => {
    it('should verify phone with correct code', async () => {
      const guest = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      // TODO: Send verification SMS to get the code
      // const verificationResult = await guestService.verifyPhone(
      //   guest.id,
      //   '123456',
      // );
      // expect(verificationResult).toBe(true);
    });

    it('should throw error for invalid code', async () => {
      const guest = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      try {
        await guestService.verifyPhone(guest.id, 'invalid');
        fail('Should throw error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      }
    });
  });

  describe('getGuest', () => {
    it('should retrieve guest by ID', async () => {
      const registered = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      const guest = await guestService.getGuest(registered.id);
      expect(guest.id).toBe(registered.id);
      expect(guest.phone).toBe('+79991234567');
    });

    it('should throw error for non-existent guest', async () => {
      try {
        await guestService.getGuest('non-existent');
        fail('Should throw error');
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.GUEST_NOT_FOUND);
      }
    });
  });

  describe('getByPhone', () => {
    it('should find guest by phone', async () => {
      const registered = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      const guest = await guestService.getByPhone('+79991234567');
      expect(guest).not.toBeNull();
      expect(guest!.id).toBe(registered.id);
    });

    it('should return null for non-existent phone', async () => {
      const guest = await guestService.getByPhone('+79999999999');
      expect(guest).toBeNull();
    });
  });

  describe('blockGuest', () => {
    it('should block guest with reason', async () => {
      const guest = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      await guestService.blockGuest(guest.id, 'Fraud detected');

      const blocked = await guestService.getGuest(guest.id);
      expect(blocked.isBlocked).toBe(true);
      expect(blocked.blockReason).toBe('Fraud detected');
    });
  });

  describe('unblockGuest', () => {
    it('should unblock guest', async () => {
      const guest = await guestService.registerGuest({
        phone: '+79991234567',
        name: 'Test',
      });

      await guestService.blockGuest(guest.id, 'Test block');
      await guestService.unblockGuest(guest.id);

      const unblocked = await guestService.getGuest(guest.id);
      expect(unblocked.isBlocked).toBe(false);
    });
  });
});
