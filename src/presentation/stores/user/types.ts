/**
 * User Store Types
 */

import type { User } from '@/domain/entities';

export interface UserState {
  users: User[];
  currentUser: User | null;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}
