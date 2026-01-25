export interface IRestaurantService {
  registerRestaurant(input: any): Promise<any>;
  getRestaurant(restaurantId: string): Promise<any>;
  updateCustomization(input: any): Promise<void>;
  defineTiers(input: any): Promise<void>;
  getStaffList(restaurantId: string): Promise<any[]>;
  assignStaff(restaurantId: string, userId: string): Promise<void>;
}
