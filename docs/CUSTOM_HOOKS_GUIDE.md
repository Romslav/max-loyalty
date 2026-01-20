# Наручник по кастомным хукам

## Доступные хуки

### 1. **useAuth** - Аутентификация

Обертка для работы с системой аутентификации.

#### Импорт
```typescript
import { useAuth } from '@/hooks';
```

#### Пример использования
```typescript
const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      // Навигация на главную
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>От правно, {user?.name}!</p>
        <button onClick={logout}>Выход</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Логин</button>
    </form>
  );
};
```

#### API
```typescript
const {
  user,                    // Текущий пользователь | null
  isAuthenticated,         // Автентифицирован
  login,                   // (credentials) => Promise
  register,                // (credentials) => Promise
  logout,                  // () => Promise
  refreshToken,            // () => Promise
  updateProfile,           // (data) => Promise
  changePassword,          // (old, new) => Promise
} = useAuth();
```

---

### 2. **usePermissions** - Контроль доступа

Проверка роли и разрешений.

#### Импорт
```typescript
import { usePermissions } from '@/hooks';
```

#### Пример использования
```typescript
const AdminDashboard: React.FC = () => {
  const { hasPermission, isAdmin, canAccessRoute, hasRole } = usePermissions();

  if (!isAdmin()) {
    return <div>Нет доступа</div>;
  }

  return (
    <div>
      {hasPermission('manage_restaurants') && (
        <button>Управление ресторанами</button>
      )}
      
      {hasAnyPermission(['view_analytics', 'export_data']) && (
        <button>Аналитика</button>
      )}
    </div>
  );
};
```

#### API
```typescript
const {
  hasPermission,           // (permission) => boolean
  hasAnyPermission,        // (permissions[]) => boolean (OR)
  hasAllPermissions,       // (permissions[]) => boolean (AND)
  hasRole,                 // (role | role[]) => boolean
  canPerformAction,        // (action, entityOwner?) => boolean
  getAllPermissions,       // () => string[]
  isAdmin,                 // () => boolean
  canAccessRoute,          // (role | role[]) => boolean
  userRole,                // Role
  userPermissions,         // Permission[]
} = usePermissions();
```

---

### 3. **useRealtime** - Real-time сообщения

интеграция Socket.IO.

#### Импорт
```typescript
import { useRealtime } from '@/hooks';
```

#### Пример использования
```typescript
const ChatComponent: React.FC = () => {
  const { on, emit, joinRoom, leaveRoom, isConnected } = useRealtime();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    joinRoom('chat');

    const unsubscribe = on('new_message', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      unsubscribe();
      leaveRoom('chat');
    };
  }, []);

  const sendMessage = async () => {
    if (isConnected()) {
      await emitWithResponse('send_message', { text: 'Hello' }, 5000);
    }
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};
```

#### API
```typescript
const {
  on,                      // (event, callback) => unsubscribe
  off,                     // (event, callback?) => void
  once,                    // (event, callback) => void
  emit,                    // (event, data?, callback?) => void
  emitWithResponse,        // (event, data?, timeout?) => Promise
  joinRoom,                // (room) => void
  leaveRoom,               // (room) => void
  isConnected,             // () => boolean
  getSocket,               // () => Socket | null
  getSocketId,             // () => string | undefined
  reconnect,               // () => void
  disconnect,              // () => void
} = useRealtime();
```

---

### 4. **useNotification** - Уведомления

Тоаст-поведомления при помощи react-hot-toast.

#### Импорт
```typescript
import { useNotification } from '@/hooks';
```

#### Пример использования
```typescript
const SaveButton: React.FC = () => {
  const { success, error, asyncNotify, promise, loading } = useNotification();

  // Основное использование
  const handleSave = async () => {
    const result = await asyncNotify(
      () => api.post('/save'),
      {
        loading: 'Сохранение...',
        success: 'Сохранено!',
        error: 'Ошибка сохранения',
      }
    );
  };

  // С Promise
  const handleUpload = () => {
    const uploadPromise = fetch('/upload').then(r => r.json());
    promise(uploadPromise, {
      loading: 'Загружаем...',
      success: 'Загружено!',
      error: 'Ошибка загружки',
    });
  };

  return (
    <>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={handleUpload}>Загружать</button>
    </>
  );
};
```

#### API
```typescript
const {
  success,                 // (message, options?) => Toast
  error,                   // (message, options?) => Toast
  info,                    // (message, options?) => Toast
  loading,                 // (message, options?) => Toast
  promise,                 // (promise, messages, options?) => Toast
  notify,                  // (message, type, options?) => Toast
  asyncNotify,             // (fn, messages) => Promise
  dismiss,                 // (toastId?) => void
  update,                  // (toastId, options) => void
  dismissAll,              // () => void
} = useNotification();
```

---

### 5. **useAsync** - Асинхронные операции

Получение данных из API.

#### Импорт
```typescript
import { useAsync, useAsyncReducer, useAsyncPaginated } from '@/hooks';
```

#### Пример использования
```typescript
// Базовая асинхронная операция
const UsersList: React.FC = () => {
  const { data: users, loading, error, retry } = useAsync(
    () => api.get('/users'),
    {
      immediate: true,
      onSuccess: (users) => console.log('Users loaded', users),
      onError: (err) => console.error('Failed to load', err),
    }
  );

  if (loading) return <div>Загружка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={retry}>Повторить</button>
    </div>
  );
};

// Пагинируемые данные
const PaginatedList: React.FC = () => {
  const {
    data,
    loading,
    page,
    hasMore,
    goToPage,
    nextPage,
    prevPage,
  } = useAsyncPaginated(
    (page, size) => api.get(`/items?page=${page}&size=${size}`),
    20
  );

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={prevPage} disabled={page === 1}>Пред</button>
      <span>{page}</span>
      <button onClick={nextPage} disabled={!hasMore}>След</button>
    </div>
  );
};
```

#### API
```typescript
// useAsync
const {
  data,                    // T | null
  loading,                 // boolean
  error,                   // Error | null
  execute,                 // () => Promise
  retry,                   // () => void
  reset,                   // () => void
} = useAsync(asyncFn, options);

// useAsyncPaginated
const {
  data,                    // T[]
  loading,                 // boolean
  error,                   // Error | null
  page,                    // number
  hasMore,                 // boolean
  total,                   // number
  goToPage,                // (page) => void
  nextPage,                // () => void
  prevPage,                // () => void
  retry,                   // () => void
} = useAsyncPaginated(asyncFn, pageSize);
```

---

### 6. **useLocalStorage** - Накопление данных

Сохранение данных в localStorage.

#### Импорт
```typescript
import {
  useLocalStorage,
  useLocalStorageJSON,
  useLocalStorageBoolean,
  useLocalStorageDebounced,
  useLocalStorageObject,
} from '@/hooks';
```

#### Пример использования
```typescript
// Строковые данные
const ProfileEditor: React.FC = () => {
  const { value: name, setValue: setName } = useLocalStorage('user_name', '');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

// Объекты
 const UserPreferences: React.FC = () => {
  const { value, updateField } = useLocalStorageObject('preferences', {
    theme: 'light',
    language: 'ru',
    notifications: true,
  });

  return (
    <>
      <select
        value={value.theme}
        onChange={(e) => updateField('theme', e.target.value)}
      >
        <option>light</option>
        <option>dark</option>
      </select>
    </>
  );
};

// С дебоунсом
 const SearchInput: React.FC = () => {
  const [query, setQuery, savedQuery] = useLocalStorageDebounced('search_query', '', 500);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      {/* savedQuery сохраняется через 500мс */}
    </div>
  );
};
```

#### API
```typescript
// useLocalStorage
const {
  value,                   // T
  setValue,                // (value) => void
  removeValue,             // () => void
} = useLocalStorage(key, initialValue, options);

// useLocalStorageObject
const {
  value,                   // T
  setValue,                // (value) => void
  removeValue,             // () => void
  updateField,             // (fieldKey, value) => void
  removeField,             // (fieldKey) => void
} = useLocalStorageObject(key, initialValue);
```

---

## Общие Примеры

### Пример 1: Проверка доступа на странице

```typescript
const ProtectedPage: React.FC = () => {
  const { canAccessRoute, isAdmin } = usePermissions();

  if (!canAccessRoute('admin')) {
    return <Navigate to="/" />;
  }

  return <AdminDashboard />;
};
```

### Пример 2: Основные операции

```typescript
const DataFetcher: React.FC = () => {
  const { success, error } = useNotification();
  const { data, loading, execute, retry } = useAsync(
    async () => {
      try {
        const response = await api.get('/data');
        success('Данные загружены');
        return response.data;
      } catch (err) {
        error('Ошибка загружки');
        throw err;
      }
    },
    { immediate: false }
  );

  return (
    <button onClick={execute} disabled={loading}>
      {loading ? 'Загружка...' : 'Получить данные'}
    </button>
  );
};
```

### Пример 3: Real-time управление

```typescript
const NotificationCenter: React.FC = () => {
  const { on, off } = useRealtime();
  const { info } = useNotification();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      info(Уведомление: ${notification.text}`);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {notifications.map((n) => (
        <div key={n.id}>{n.text}</div>
      ))}
    </div>
  );
};
```

---

## Бесплатные ресурсы

- [Официальная документация React Hooks](https://react.dev/reference/react/hooks)
- [react-hot-toast документация](https://hot-toast.com/)
- [Socket.IO руководство](https://socket.io/docs/)
- [TypeScript документация](https://www.typescriptlang.org/docs/)

---

## Направления на внимание

### Когда использовать

- **useAuth**: Любые компоненты с элементами авторизации
- **usePermissions**: Основнованные на роли страницы
- **useRealtime**: Компоненты с real-time целовыми
- **useNotification**: Юбые ювым вебсайты
- **useAsync**: Любые компоненты с удаленными данными
- **useLocalStorage**: Компоненты до памяти настроек
