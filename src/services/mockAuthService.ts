import { User } from './authService';

// Mock users for testing
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@test.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'admin',
    },
  },
  'restaurant@test.com': {
    password: 'restaurant123',
    user: {
      id: '2',
      email: 'restaurant@test.com',
      name: 'Restaurant Manager',
      role: 'restaurant',
      restaurantId: 'rest-1',
    },
  },
  'cashier@test.com': {
    password: 'cashier123',
    user: {
      id: '3',
      email: 'cashier@test.com',
      name: 'Cashier User',
      role: 'cashier',
      restaurantId: 'rest-1',
    },
  },
  'guest@test.com': {
    password: 'guest123',
    user: {
      id: '4',
      email: 'guest@test.com',
      name: 'Guest User',
      role: 'guest',
    },
  },
};

const generateToken = (): string => {
  return 'mock_' + Math.random().toString(36).substr(2, 9) + '_token';
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  async login(email: string, password: string) {
    await delay(500);

    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    return {
      token: generateToken(),
      refreshToken: generateToken(),
      user: user.user,
    };
  },

  async register(name: string, email: string, password: string, role: string) {
    await delay(500);

    if (MOCK_USERS[email]) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Math.random().toString(),
      email,
      name,
      role: role as any,
    };

    return {
      token: generateToken(),
      refreshToken: generateToken(),
      user: newUser,
    };
  },

  async refreshToken() {
    await delay(300);
    return {
      token: generateToken(),
      refreshToken: generateToken(),
    };
  },
};

// Logging
console.log('\n🎭 MOCK AUTH SERVICE ACTIVE');
console.log('\nTest accounts available:');
console.log('\n👤 Admin:');
console.log('  Email: admin@test.com');
console.log('  Password: admin123');
console.log('\n🏪 Restaurant Manager:');
console.log('  Email: restaurant@test.com');
console.log('  Password: restaurant123');
console.log('\n💳 Cashier:');
console.log('  Email: cashier@test.com');
console.log('  Password: cashier123');
console.log('\n👥 Guest:');
console.log('  Email: guest@test.com');
console.log('  Password: guest123');
console.log('\nOr register with any email/password combination\n');
