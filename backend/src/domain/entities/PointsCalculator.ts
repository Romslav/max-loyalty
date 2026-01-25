export class PointsCalculator {
  static calculatePointsAwarded(amountRubles: number, tierDiscountPercent: number): { basePoints: number; bonusPoints: number; totalPoints: number } {
    const basePoints = Math.floor(amountRubles);
    const bonusPoints = Math.round(basePoints * (tierDiscountPercent / 100));
    const totalPoints = basePoints + bonusPoints;

    return { basePoints, bonusPoints, totalPoints };
  }

  static calculateExpireDate(days: number = 365): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  static getTierByPoints(points: number): string {
    if (points < 1000) return 'BRONZE';
    if (points < 5000) return 'SILVER';
    if (points < 10000) return 'GOLD';
    if (points < 25000) return 'PLATINUM';
    return 'VIP';
  }

  static getDiscountByTier(tierName: string): number {
    const discounts: { [key: string]: number } = {
      BRONZE: 5,
      SILVER: 10,
      GOLD: 15,
      PLATINUM: 20,
      VIP: 25,
    };
    return discounts[tierName] || 0;
  }
}
