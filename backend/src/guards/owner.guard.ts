import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Allow ADMIN users
    if (user.role === 'ADMIN') {
      return true;
    }

    // Allow users with OWNER or MANAGER role in restaurants
    if (user.role === 'OWNER' || user.role === 'STAFF') {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
