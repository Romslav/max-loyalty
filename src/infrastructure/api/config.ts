/**
 * API Client Configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.maxloyalty.com';
const API_TIMEOUT = 30000; // 30 seconds
const API_RETRY_ATTEMPTS = 3;
const API_RETRY_DELAY = 1000; // 1 second

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  retryAttempts: API_RETRY_ATTEMPTS,
  retryDelay: API_RETRY_DELAY,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * API Endpoints
 */
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
  },
  // User
  user: {
    profile: '/user/profile',
    update: '/user/profile',
    settings: '/user/settings',
  },
  // Points
  points: {
    balance: '/points/balance',
    history: '/points/history',
    add: '/points/add',
    spend: '/points/spend',
  },
  // Rewards
  rewards: {
    list: '/rewards',
    redeem: '/rewards/redeem',
    my: '/rewards/my',
  },
  // Transactions
  transactions: {
    list: '/transactions',
    detail: '/transactions/:id',
  },
};

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
