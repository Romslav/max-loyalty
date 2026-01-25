export interface ICardService {
  generateQRToken(guestRestaurantId: string, restaurantId: string): string;
  validateQRToken(token: string, restaurantId: string): any;
  generate6DigitCode(): string;
  validate6DigitCode(code: string, restaurantId: string): any;
  invalidateCard(cardId: string, transactionId: string): Promise<void>;
  getActiveCard(guestRestaurantId: string, restaurantId: string): Promise<any | null>;
}
