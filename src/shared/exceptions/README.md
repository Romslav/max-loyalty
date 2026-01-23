# Error Handling & Exception Management

## Overview

Comprehensive error handling system with:
- Custom AppError class with severity levels
- Error handler with callbacks
- useError composable for components
- Automatic error normalization
- Error history tracking

## Error Types

```typescript
import { ErrorType, ErrorSeverity } from '@/shared/exceptions';

// Client Errors
ErrorType.VALIDATION_ERROR
ErrorType.INVALID_INPUT
ErrorType.MISSING_PARAM

// Auth Errors
ErrorType.UNAUTHORIZED
ErrorType.FORBIDDEN
ErrorType.TOKEN_EXPIRED
ErrorType.INVALID_CREDENTIALS

// Network Errors
ErrorType.NETWORK_ERROR
ErrorType.TIMEOUT
ErrorType.CONNECTION_REFUSED

// Server Errors
ErrorType.SERVER_ERROR
ErrorType.NOT_FOUND
ErrorType.CONFLICT

// Business Logic
ErrorType.BUSINESS_LOGIC_ERROR
ErrorType.INSUFFICIENT_BALANCE
ErrorType.INVALID_STATE

// Severity Levels
ErrorSeverity.LOW       // Info level
ErrorSeverity.MEDIUM    // Warning level
ErrorSeverity.HIGH      // Error level
ErrorSeverity.CRITICAL  // Critical level
```

## AppError Class

```typescript
import { AppError, ErrorType, ErrorSeverity } from '@/shared/exceptions';

const error = new AppError('Email already in use', {
  type: ErrorType.CONFLICT,
  code: 'EMAIL_EXISTS',
  statusCode: 409,
  severity: ErrorSeverity.MEDIUM,
  context: { email: 'user@example.com' },
});

// Access properties
error.message        // 'Email already in use'
error.type          // ErrorType.CONFLICT
error.code          // 'EMAIL_EXISTS'
error.statusCode    // 409
error.severity      // ErrorSeverity.MEDIUM
error.context       // { email: 'user@example.com' }
error.timestamp     // Date instance
error.isOperational // boolean (true by default)

// Convert to JSON
error.toJSON()
```

## ErrorHandler

### Setup

```typescript
import { errorHandler, ErrorHandler } from '@/shared/exceptions';
import { useUIStore } from '@/application';

const uiStore = useUIStore();

// Use singleton
errorHandler.handle(error);

// Or create instance
const handler = new ErrorHandler({
  logErrors: true,
  logStackTrace: true,
  onError: (error) => uiStore.showError(error.message),
  onWarning: (error) => uiStore.showWarning(error.message),
  onCritical: (error) => uiStore.showError(error.message),
});
```

### Methods

```typescript
// Handle error (normalize + log + notify)
await errorHandler.handle(error);

// Normalize any error to AppError
const appError = errorHandler.normalize(unknownError);

// Register callback for severity level
errorHandler.on(ErrorSeverity.CRITICAL, (error) => {
  sendToMonitoring(error);
});

// Clear all callbacks
errorHandler.clear();
```

## useError Composable

### Basic Usage

```typescript
import { useError } from '@/presentation';

const { handleError, currentError, hasError } = useError();

try {
  await riskyOperation();
} catch (error) {
  await handleError(error, {
    showNotification: true,
    logError: true,
  });
}
```

### State & Computed

```typescript
const error = useError();

// State
error.currentError   // Current AppError or null
error.errorHistory   // Array of all errors
error.errorCount     // Number of errors

// Computed
error.hasError       // boolean
error.errorMessage   // string
error.errorCode      // string
error.errorType      // ErrorType
```

### Methods

```typescript
const error = useError();

// Handle error with options
await error.handleError(unknownError, {
  showNotification: true,  // Show toast
  logError: true,          // Log to console
  throwError: false,       // Throw after handling
});

// Clear current error
error.clearError();

// Clear error history
error.clearHistory();

// Check error type
if (error.isErrorType(ErrorType.VALIDATION_ERROR)) {
  // Handle validation error
}

// Retry with error handling
const result = await error.withErrorHandling(
  () => fetchData(),
  { retries: 3, delay: 1000 }
);

// Error handling with tuple result
const [data, err] = await error.wrap(
  () => fetchData(),
  { showNotification: true }
);

if (err) {
  console.error('Error:', err.message);
} else {
  console.log('Success:', data);
}
```

## Common Patterns

### Service with Error Handling

```typescript
import { AppError, ErrorType } from '@/shared/exceptions';

class UserService {
  async getProfile() {
    if (!token) {
      throw new AppError('Not authenticated', {
        type: ErrorType.UNAUTHORIZED,
        statusCode: 401,
        severity: ErrorSeverity.HIGH,
      });
    }
    // ...
  }

  async updateProfile(data) {
    if (!data.email) {
      throw new AppError('Email is required', {
        type: ErrorType.VALIDATION_ERROR,
        statusCode: 400,
        severity: ErrorSeverity.LOW,
      });
    }
    // ...
  }
}
```

### Component with Error Handling

```vue
<template>
  <div>
    <button @click="handleSubmit" :disabled="isLoading">
      Submit
    </button>
    <p v-if="error.hasError" class="error">
      {{ error.errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useError } from '@/presentation';
import { userService } from '@/infrastructure';

const isLoading = ref(false);
const error = useError();

const handleSubmit = async () => {
  isLoading.value = true;
  const [data, err] = await error.wrap(
    () => userService.updateProfile(formData),
    { showNotification: true }
  );
  isLoading.value = false;

  if (data) {
    console.log('Success!');
  }
};
</script>
```

### Async Action with Retry

```typescript
const error = useError();

const fetchWithRetry = () => {
  return error.withErrorHandling(
    () => api.fetchData(),
    {
      retries: 3,
      delay: 2000,
      showNotification: true,
    }
  );
};
```

### Global Error Handler Setup

```typescript
// main.ts
import { createApp } from 'vue';
import { errorHandler } from '@/shared/exceptions';
import { useUIStore } from '@/application';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Setup global error handler
const uiStore = useUIStore();

errorHandler.on(ErrorSeverity.CRITICAL, async (error) => {
  console.error('Critical error:', error);
  uiStore.showError(
    'A critical error occurred. Please refresh the page.',
    'Critical Error'
  );
});

window.addEventListener('error', (event) => {
  errorHandler.handle(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handle(event.reason);
});
```

## Type Safety

```typescript
import { AppError, isAppError, ErrorType } from '@/shared/exceptions';

function handleUnknown(error: unknown) {
  // Type guard
  if (isAppError(error)) {
    console.log('App Error:', error.type);
  } else if (error instanceof Error) {
    console.log('Standard Error:', error.message);
  } else {
    console.log('Unknown error');
  }
}
```

## Error Normalization

ErrorHandler automatically converts any error to AppError:

```typescript
// String → AppError
errorHandler.normalize('Something went wrong');

// Error → AppError
errorHandler.normalize(new Error('Network failed'));

// Object → AppError
errorHandler.normalize({ code: 'ERR_001', message: 'Custom error' });

// Already AppError → AppError
errorHandler.normalize(new AppError('Already app error'));
```

## Best Practices

✅ Always throw AppError with appropriate type
✅ Include context for debugging
✅ Set correct severity level
✅ Use proper HTTP status codes
✅ Register error handlers for critical errors
✅ Log errors for monitoring
✅ Show user-friendly messages
✅ Handle errors in components with useError
✅ Use retry for transient failures
✅ Clear errors when appropriate
