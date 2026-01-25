export class RestaurantEntity {
  id: string;
  name: string;
  inn: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.inn = data.inn;
    this.address = data.address;
    this.city = data.city;
    this.phone = data.phone;
    this.email = data.email;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static create(data: any): RestaurantEntity {
    return new RestaurantEntity(data);
  }

  updateProgramName(name: string): void {
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.updatedAt = new Date();
  }

  updatePointsPerRuble(points: number): void {
    this.updatedAt = new Date();
  }

  updatePointsExpireDays(days: number): void {
    this.updatedAt = new Date();
  }
}
