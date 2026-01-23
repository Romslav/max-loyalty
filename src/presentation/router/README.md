# Маршрутизаторная система MAX Loyalty

## Структура

```
router/
├── index.ts          # Главная конфигурация маршрутизатора
├── types.ts          # Типы и интерфейсы
├── guards.ts         # Guard'ы для проверки доступа
├── navigation.ts     # Конфигурация навигации
├── routes/
│   ├── index.ts      # Агрегация всех маршрутов
│   ├── guest.ts      # Гостевые маршруты (login, register и т.д.)
│   ├── user.ts       # Пользовательские маршруты (dashboard, rewards и т.д.)
│   └── core.ts       # Общие маршруты (404, error)
```

## Маршруты

### Гостевые маршруты
- `/login` - Вход
- `/register` - Регистрация
- `/forgot-password` - Восстановление пароля
- `/verify-email` - Подтверждение email

### Пользовательские маршруты
- `/dashboard` - Кабинет
- `/rewards` - Награды
- `/transactions` - История
- `/profile` - Профиль

### Системные маршруты
- `/error` - Страница ошибки
- `404` - Страница не найдена

## Guard'ы

### checkAuthGuard
Проверяет аутентификацию пользователя. Требует `requiresAuth` в meta маршрута.

### checkPermissionsGuard
Проверяет права доступа пользователя. Требует `requiresAdmin` в meta маршрута.

### checkEmailVerificationGuard
Проверяет верификацию email. Требует `requiresEmailVerification` в meta маршрута.

### updatePageTitleGuard
Обновляет title страницы и meta описание на основе маршрута.

## Использование

```typescript
import { useRouter, useRoute } from 'vue-router';
import { useNavigation, useRouterComposable } from '@/presentation/composables';

export default defineComponent({
  setup() {
    const { navigate, navigationLinks } = useNavigation();
    const { navigateTo, goHome, currentPath } = useRouterComposable();

    return {
      navigate,
      navigationLinks,
      navigateTo,
      goHome,
      currentPath,
    };
  },
});
```

## Метаданные маршрута

```typescript
interface RouteMeta {
  title?: string;              // Название страницы
  description?: string;        // Описание страницы
  requiresAuth?: boolean;      // Требуется аутентификация
  requiresGuest?: boolean;     // Требуется НЕ быть аутентифицированным
  requiresAdmin?: boolean;     // Требуются права администратора
  layout?: 'default' | 'guest' | 'auth' | 'empty'; // Тип макета
  icon?: string;               // Иконка в меню
  breadcrumb?: string;         // Текст breadcrumb
  order?: number;              // Порядок в меню
}
```

## Навигационные composables

### useNavigation
- `navigationLinks` - Ссылки навигации в зависимости от статуса
- `userMenuItems` - Пункты меню для пользователя
- `guestMenuItems` - Пункты меню для гостя
- `isActive(name)` - Проверка активной страницы
- `navigate(to)` - Навигация с закрытием мобильного меню
- `toggleMobileMenu()` - Переключить мобильное меню

### useRouterComposable
- `currentPath` - Текущий путь
- `currentName` - Имя текущего маршрута
- `currentParams` - Параметры маршрута
- `currentQuery` - Query параметры
- `navigateTo(to)` - Навигация
- `goHome()` - На главную
- `goLogin()` - На вход
- `goRegister()` - На регистрацию
