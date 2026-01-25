export class GuestChildEntity {
  id: string;
  guestId: string;
  name: string;
  dateOfBirth: Date;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestId = data.guestId;
    this.name = data.name;
    this.dateOfBirth = data.dateOfBirth;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): GuestChildEntity {
    return new GuestChildEntity(data);
  }
}
