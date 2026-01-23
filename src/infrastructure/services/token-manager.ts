/**
 * Token Manager - Управление токенами
 */

interface TokenPair {
  access: string;
  refresh: string;
  expiresIn: number; // seconds
}

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly EXPIRY_KEY = 'auth_expiry';
  private refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Сохранить токены
   */
  setTokens(tokens: TokenPair) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
    const expiryTime = Date.now() + tokens.expiresIn * 1000;
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
    this.scheduleRefresh(tokens.expiresIn);
  }

  /**
   * Получить access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Получить refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Проверить наличие token
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Получить token для Authorization header
   */
  getAuthHeader(): string {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : '';
  }

  /**
   * Проверить истек ли token
   */
  isExpired(): boolean {
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }

  /**
   * Проверить работоспособность token
   */
  isValid(): boolean {
    return this.hasToken() && !this.isExpired();
  }

  /**
   * Очистить все токены
   */
  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    this.cancelRefresh();
  }

  /**
   * Обновить access token
   */
  updateAccessToken(token: string, expiresIn: number) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
    this.scheduleRefresh(expiresIn);
  }

  /**
   * Декодировать token
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Отложить рефреш
   */
  private scheduleRefresh(expiresIn: number) {
    this.cancelRefresh();
    // Refresh at 80% of token life
    const refreshTime = (expiresIn * 0.8) * 1000;
    this.refreshTimer = setTimeout(() => {
      this.emitRefreshNeeded();
    }, refreshTime);
  }

  /**
   * Отменить refresh
   */
  private cancelRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Пустить событие refresh needed
   */
  private emitRefreshNeeded() {
    window.dispatchEvent(new CustomEvent('token:refresh-needed'));
  }
}

export const tokenManager = new TokenManager();
export { TokenManager };
