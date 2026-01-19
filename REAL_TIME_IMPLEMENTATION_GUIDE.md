# 🚀 Real-Time Notifications - Implementation Guide

**Дата:** 2026-01-19
**Статус:** Ready for Implementation

---

## 📋 Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install socket.io-client zustand devtools

# Backend
npm install socket.io socket.io-redis-adapter redis jsonwebtoken
```

---

## 🔧 Frontend Setup

### Step 1: Add Files to Project

```bash
src/
├── services/
│   └── websocketService.ts          # ✅ Created
├── stores/
│   └── notificationStore.ts         # ✅ Created
├── hooks/
│   └── useNotifications.ts          # ✅ Created
└── components/
    └── notifications/
        ├── ToastContainer.tsx       # ✅ Created
        ├── NotificationCenter.tsx   # ✅ Created
        └── index.ts                 # ✅ Created
```

### Step 2: Update App.tsx

```typescript
// src/App.tsx

import { useNotifications } from '@hooks/useNotifications';
import { ToastContainer, NotificationCenter } from '@components/notifications';

function App() {
  const { user } = useAuthStore();
  
  // Initialize notifications (this connects WebSocket)
  const { isConnected } = useNotifications({
    autoConnect: true,
    debug: process.env.NODE_ENV === 'development'
  });

  return (
    <div>
      {/* Notification Center */}
      {user && <NotificationCenter />}
      
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Your routes */}
    </div>
  );
}
```

### Step 3: Configure Environment Variables

```bash
# .env
VITE_WS_URL=ws://localhost:3000
```

for production:

```bash
# .env.production
VITE_WS_URL=wss://api.maxloyalty.com
```

---

## 🔌 Backend Setup

### Step 1: Add WebSocket Server to Express

```typescript
// backend/src/server.ts

import express from 'express';
import http from 'http';
import { WebSocketServer } from './websocket/websocketServer';
import { EventHandlers } from './websocket/eventHandlers';

const app = express();
const httpServer = http.createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer(httpServer);
export const eventHandlers = new EventHandlers(wsServer);

// Start server
httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
```

### Step 2: Copy Files to Backend

```bash
backend/src/
├── websocket/
│   ├── websocketServer.ts    # ✅ Created
│   └── eventHandlers.ts      # ✅ Created
└── routes/
    └── api/
        └── points/
            └── pointsController.ts  # To update
```

### Step 3: Update Points Controller (Example)

```typescript
// backend/src/routes/api/points/pointsController.ts

import { eventHandlers } from '@root/server';

export async function addPoints(
  guestId: string,
  restaurantId: string,
  amount: number,
  description: string
) {
  try {
    // Create transaction in database
    const transaction = await Transaction.create({
      guestId,
      restaurantId,
      amount,
      description,
      type: 'purchase',
    });

    // Update guest points balance
    const guest = await Guest.findByIdAndUpdate(
      guestId,
      { $inc: { pointsBalance: amount } },
      { new: true }
    );

    // Emit real-time event via WebSocket
    eventHandlers.onPointsAdded({
      transactionId: transaction._id,
      guestId: guest._id,
      cardId: guest.cardId,
      amount,
      newBalance: guest.pointsBalance,
      restaurantId,
      restaurantName: restaurant.name,
      description,
      timestamp: Date.now(),
    });

    return transaction;
  } catch (error) {
    console.error('[Points] Add points error:', error);
    throw error;
  }
}
```

---

## 📡 Testing Real-Time Notifications

### Test 1: Points Added

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Test WebSocket
curl -X POST http://localhost:3000/api/points/add \
  -H "Content-Type: application/json" \
  -d "{
    \"guestId\": \"guest123\",
    \"restaurantId\": \"restaurant123\",
    \"amount\": 100,
    \"description\": \"Purchase at restaurant\"
  }"
```

You should see:
1. ✅ Toast notification in top-right corner
2. ✅ Notification badge updated
3. ✅ Notification appears in NotificationCenter

### Test 2: Connection Status

```typescript
// In browser console
const { websocketService } = await import('@services/websocketService');
console.log('WebSocket active:', websocketService.isActive());
console.log('Socket ID:', websocketService.getSocketId());
```

---

## 🏗️ Architecture Overview

### Data Flow for Points Added

```
┌─────────────────────────────────────────────────────┐
│ API Request: POST /api/points/add                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Backend Points Controller                           │
│  - Create transaction in DB                        │
│  - Update guest balance                            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ eventHandlers.onPointsAdded()                      │
│  - Broadcast to restaurant room                    │
│  - Broadcast to guest room                         │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  ┌──────────────┐         ┌──────────────┐
  │ Guest Client │         │Restaurant    │
  │              │         │Client        │
  ├──────────────┤         ├──────────────┤
  │ WebSocket    │         │ WebSocket    │
  │ receives     │         │ receives     │
  │ points_added │         │ points_added │
  └────────┬─────┘         └────────┬─────┘
           │                        │
           ▼                        ▼
  ┌──────────────────────────────────────┐
  │ useNotifications hook                │
  │  - notificationStore.addNotification │
  │  - notificationStore.showNotification│
  └───────┬──────────────────────────────┘
           │
           ▼
  ┌──────────────────────────────────────┐
  │ UI Updates                           │
  │  - Toast appears                     │
  │  - Notification badge updates        │
  │  - NotificationCenter updates        │
  └──────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

### Frontend
- [ ] WebSocket connects on login
- [ ] Toast notifications appear for points_added
- [ ] Toast notifications appear for points_redeemed
- [ ] Notification badge shows unread count
- [ ] NotificationCenter opens/closes
- [ ] Notifications can be marked as read
- [ ] Notifications can be deleted
- [ ] Sound plays when notification received (if enabled)
- [ ] Connection status indicator works
- [ ] Re-connection works after disconnect

### Backend
- [ ] WebSocket server starts without errors
- [ ] Authentication middleware validates JWT
- [ ] Subscription to rooms works
- [ ] Events broadcast to correct rooms
- [ ] Error handling works
- [ ] Multiple connections from same user handled
- [ ] Disconnect cleanup works

### Integration
- [ ] Points added → Real-time notification works
- [ ] Points redeemed → Real-time notification works
- [ ] Multiple users receive updates independently
- [ ] Restaurant sees guest join in real-time
- [ ] Admin receives system alerts
- [ ] Notifications persist after refresh (optional)

---

## 🔄 Reconnection Strategy

The WebSocket service automatically handles reconnection:

```typescript
Socket.io Configuration (in websocketService.ts):
- reconnection: true
- reconnectionDelay: 1000ms (starts)
- reconnectionDelayMax: 5000ms (max)
- maxReconnectionAttempts: 5

After disconnect:
1. Try to reconnect after 1 second
2. If fails, wait 2 seconds, try again
3. Exponential backoff up to 5 seconds
4. Stop after 5 failed attempts

All queued messages flush on reconnection.
```

---

## 📊 Monitoring WebSocket

### Browser DevTools

```javascript
// Check connection status
const { websocketService } = window.__notificationDebug;
console.log('Status:', websocketService.isActive() ? 'Connected' : 'Disconnected');

// Listen to connection events
const unsubscribe = websocketService.on('_system_connected', (data) => {
  console.log('Connected:', data);
});
```

### Backend Logs

```
[WebSocket] User abc123 connected (socket: socket-id-xyz)
[Subscribe] abc123 joined guest:abc123
[Broadcast] Points added to { restaurant: rest-1, guest: abc123 }
[WebSocket] User abc123 disconnected
```

---

## 🐛 Troubleshooting

### Issue: WebSocket not connecting

```bash
# Check if backend WebSocket server is running
nelstat -tln | grep 3000

# Check JWT token is valid
echo $token | jwt decode

# Enable debug mode
use useNotifications({ debug: true })
```

### Issue: Notifications not appearing

1. Check WebSocket connection status
2. Verify user is subscribed to correct room
3. Check browser console for errors
4. Verify backend is emitting events

### Issue: High memory usage

- Check notification store size (should be <100 items)
- Clear old system events
- Check for memory leaks in event listeners

---

## 📚 API Reference

### useNotifications Hook

```typescript
const { isConnected, subscribe, unsubscribe, emit, socketId } = useNotifications({
  autoConnect: true,  // Auto-connect on auth
  debug: false        // Enable debug logs
});
```

### notificationStore

```typescript
const {
  // State
  notifications,
  unreadCount,
  toasts,
  systemEvents,
  
  // Actions
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  showNotification,
  hideNotification,
} = useNotificationStore();
```

### WebSocket Events

**Client → Server:**
- `subscribe` - Subscribe to channel
- `unsubscribe` - Unsubscribe from channel
- `action` - Send custom action

**Server → Client:**
- `connected` - Connection established
- `disconnected` - Connection lost
- `points_added` - Points added event
- `points_redeemed` - Points redeemed event
- `card_created` - Card created event
- `guest_registered` - Guest registered event
- `error` - Error occurred

---

## 🚀 Production Deployment

### 1. Enable HTTPS/WSS

```typescript
// backend/src/server.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem'),
};

const httpsServer = https.createServer(options, app);
const wsServer = new WebSocketServer(httpsServer);
```

### 2. Setup Redis Adapter for Scaling

```typescript
// backend/src/websocket/websocketServer.ts

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ host: 'redis-host', port: 6379 });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);
this.io.adapter(createAdapter(pubClient, subClient));
```

### 3. Setup Load Balancer

```nginx
# nginx.conf
upstream websocket {
  server ws-server-1:3000;
  server ws-server-2:3000;
  server ws-server-3:3000;
}

server {
  location /socket.io {
    proxy_pass http://websocket;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
  }
}
```

---

## 📋 Next Steps

1. ✅ Copy all files from this guide
2. ✅ Install dependencies
3. ✅ Update environment variables
4. ✅ Test locally
5. ⏭️ Deploy to staging
6. ⏭️ Load test (concurrent connections)
7. ⏭️ Monitor in production
8. ⏭️ Optimize based on metrics

---

**Status: Ready for Integration** ✅

All files have been created and are ready to be integrated into your project.
