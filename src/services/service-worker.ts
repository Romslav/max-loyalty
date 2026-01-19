// Service Worker для оффлайн режима и PWA
const CACHE_NAME = 'max-loyalty-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
]

// Установка Service Worker
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Service Worker: кэширование статических ассетов')
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('⚠️ Некоторые ассеты не могут быть кэшированы')
      })
    })
  )
  self.skipWaiting()
})

// Активация Service Worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: удаление старого кэша')
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Перехват сетевых запросов
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // Пропускаем non-GET запросы
  if (request.method !== 'GET') {
    return
  }

  // Пропускаем API запросы (они синхронизируются отдельно)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline', cached: false }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    return
  }

  // Для статических ассетов: кэш, затем сеть
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Обновляем кэш в фоне
        fetch(request)
          .then((freshResponse) => {
            if (freshResponse && freshResponse.status === 200) {
              const responseToCache = freshResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache)
              })
            }
          })
          .catch(() => {})

        return response
      }

      return fetch(request)
        .then((response) => {
          // Кэшируем успешные ответы
          if (response && response.status === 200 && response.type !== 'error') {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Если оффлайн и нет кэша, показываем offline страницу
          return caches.match('/offline.html').catch(() => {
            return new Response('Offline', { status: 503 })
          })
        })
    })
  )
})

// Обработка push уведомлений (для future использования)
self.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/logo.png',
        badge: '/badge.png',
        tag: data.tag || 'notification',
      })
    )
  }
})

// Обработка клика на уведомление
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return (client as WindowClient).focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})

export {}
