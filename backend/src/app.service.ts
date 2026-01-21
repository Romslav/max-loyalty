import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MaxLoyalty API - Loyalty Program Management System';
  }
}
