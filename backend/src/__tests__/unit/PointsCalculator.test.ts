import { PointsCalculator } from '../../domain/entities';

describe('PointsCalculator', () => {
  describe('calculatePointsAwarded', () => {
    it('should calculate base points (1 ruble = 1 point)', () => {
      const result = PointsCalculator.calculatePointsAwarded(100, 0);
      expect(result.basePoints).toBe(100);
    });

    it('should calculate bonus points (5% for BRONZE tier)', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000, 5);
      expect(result.basePoints).toBe(1000);
      expect(result.bonusPoints).toBe(50);
      expect(result.totalPoints).toBe(1050);
    });

    it('should calculate bonus points (10% for SILVER tier)', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000, 10);
      expect(result.basePoints).toBe(1000);
      expect(result.bonusPoints).toBe(100);
      expect(result.totalPoints).toBe(1100);
    });

    it('should calculate bonus points (15% for GOLD tier)', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000, 15);
      expect(result.basePoints).toBe(1000);
      expect(result.bonusPoints).toBe(150);
      expect(result.totalPoints).toBe(1150);
    });

    it('should calculate bonus points (20% for PLATINUM tier)', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000, 20);
      expect(result.basePoints).toBe(1000);
      expect(result.bonusPoints).toBe(200);
      expect(result.totalPoints).toBe(1200);
    });

    it('should calculate bonus points (25% for VIP tier)', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000, 25);
      expect(result.basePoints).toBe(1000);
      expect(result.bonusPoints).toBe(250);
      expect(result.totalPoints).toBe(1250);
    });

    it('should handle zero amount', () => {
      const result = PointsCalculator.calculatePointsAwarded(0, 5);
      expect(result.basePoints).toBe(0);
      expect(result.bonusPoints).toBe(0);
      expect(result.totalPoints).toBe(0);
    });

    it('should handle large amounts', () => {
      const result = PointsCalculator.calculatePointsAwarded(1000000, 15);
      expect(result.basePoints).toBe(1000000);
      expect(result.bonusPoints).toBe(150000);
      expect(result.totalPoints).toBe(1150000);
    });

    it('should handle fractional discount percentages', () => {
      const result = PointsCalculator.calculatePointsAwarded(333, 7.5);
      expect(result.basePoints).toBe(333);
      expect(result.bonusPoints).toBe(25); // 333 * 0.075 = 24.975 ≈ 25
    });

    it('should round bonus points correctly', () => {
      const result = PointsCalculator.calculatePointsAwarded(1500, 13);
      expect(result.basePoints).toBe(1500);
      expect(result.bonusPoints).toBe(195); // 1500 * 0.13 = 195
    });
  });

  describe('calculateExpireDate', () => {
    it('should return correct expiration date (default 365 days)', () => {
      const now = new Date();
      const expireDate = PointsCalculator.calculateExpireDate();
      const diff = expireDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      expect(days).toBe(365);
    });

    it('should return correct expiration date (custom days)', () => {
      const now = new Date();
      const expireDate = PointsCalculator.calculateExpireDate(180);
      const diff = expireDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      expect(days).toBe(180);
    });

    it('should return correct expiration date (90 days)', () => {
      const now = new Date();
      const expireDate = PointsCalculator.calculateExpireDate(90);
      const diff = expireDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      expect(days).toBe(90);
    });
  });

  describe('getTierByPoints', () => {
    it('should return BRONZE for 0-999 points', () => {
      expect(PointsCalculator.getTierByPoints(0)).toBe('BRONZE');
      expect(PointsCalculator.getTierByPoints(500)).toBe('BRONZE');
      expect(PointsCalculator.getTierByPoints(999)).toBe('BRONZE');
    });

    it('should return SILVER for 1000-4999 points', () => {
      expect(PointsCalculator.getTierByPoints(1000)).toBe('SILVER');
      expect(PointsCalculator.getTierByPoints(2500)).toBe('SILVER');
      expect(PointsCalculator.getTierByPoints(4999)).toBe('SILVER');
    });

    it('should return GOLD for 5000-9999 points', () => {
      expect(PointsCalculator.getTierByPoints(5000)).toBe('GOLD');
      expect(PointsCalculator.getTierByPoints(7500)).toBe('GOLD');
      expect(PointsCalculator.getTierByPoints(9999)).toBe('GOLD');
    });

    it('should return PLATINUM for 10000-24999 points', () => {
      expect(PointsCalculator.getTierByPoints(10000)).toBe('PLATINUM');
      expect(PointsCalculator.getTierByPoints(17500)).toBe('PLATINUM');
      expect(PointsCalculator.getTierByPoints(24999)).toBe('PLATINUM');
    });

    it('should return VIP for 25000+ points', () => {
      expect(PointsCalculator.getTierByPoints(25000)).toBe('VIP');
      expect(PointsCalculator.getTierByPoints(50000)).toBe('VIP');
      expect(PointsCalculator.getTierByPoints(1000000)).toBe('VIP');
    });
  });
});
