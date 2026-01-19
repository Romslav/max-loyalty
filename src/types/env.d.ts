/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_JWT_ALGORITHM: string;
  readonly VITE_TOKEN_EXPIRY: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;
  readonly VITE_WS_URL: string;
  readonly VITE_WS_RECONNECT_INTERVAL: string;
  readonly VITE_TELEGRAM_BOT_TOKEN: string;
  readonly VITE_TELEGRAM_WEBHOOK_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string;
  readonly VITE_ENABLE_OFFLINE_MODE: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_LOG_TO_CONSOLE: string;
  readonly VITE_LOG_TO_SENTRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}