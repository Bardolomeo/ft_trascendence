# WebSocket Multiplayer Implementation Plan
**Date:** November 7, 2025  
**Status:** Planning Phase - Not Yet Implemented

---

## 📊 Current Project State

### What You Have (Working)
- ✅ Docker microservices architecture
- ✅ NGINX reverse proxy with SSL (ultrapong domain)
- ✅ Login service (backend/Login_service) - Node.js/Fastify
- ✅ Frontend service - HTML/TailwindCSS
- ✅ SQLite database with users table
- ✅ Basic login/register UI

### What's Missing
- ❌ JWT authentication (passwords not hashed, no token system)
- ❌ Pong game implementation (canvas exists but empty)
- ❌ WebSocket game server
- ❌ Multiplayer functionality
- ❌ Matchmaking system

---

## 🎯 WebSocket Multiplayer Architecture Plan

### New Service to Create
```
backend/Game_service/
├── Dockerfile
├── package.json
├── tsconfig.json
├── index.ts                    # WebSocket server entry
├── src/
│   ├── GameServer.ts          # Main WebSocket logic
│   ├── GameRoom.ts            # Individual game instance (ball physics, paddles)
│   ├── Matchmaker.ts          # Queue & player pairing
│   ├── physics/
│   │   ├── Ball.ts
│   │   ├── Paddle.ts
│   │   └── Collision.ts
│   └── database/
│       └── gameDb.ts          # DB queries for game data
```

### Database Schema Extensions Needed

```sql
-- Extend existing users table
ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN last_login DATETIME;
ALTER TABLE users ADD COLUMN wins INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN losses INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'offline'; -- online, in_game, offline

-- New: Match history
CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    player1_score INTEGER NOT NULL,
    player2_score INTEGER NOT NULL,
    winner_id INTEGER,
    duration_seconds INTEGER,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    match_type TEXT DEFAULT 'ranked',
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id)
);

-- New: Active games (for reconnection)
CREATE TABLE active_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_room_id TEXT UNIQUE NOT NULL,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    player1_score INTEGER DEFAULT 0,
    player2_score INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id)
);

-- New: Matchmaking queue
CREATE TABLE matchmaking_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    skill_level INTEGER DEFAULT 1000,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🏗️ System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌───────────────┐
│  Browser 1  │         │    NGINX     │         │  Browser 2    │
│  (Player 1) │◄───────►│   Port 443   │◄───────►│  (Player 2)   │
└─────────────┘         └──────┬───────┘         └───────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼──────┐     ┌──────▼───────┐    ┌──────▼───────┐
    │  Frontend  │     │Login Service │    │ Game Service │
    │ Port 3000  │     │  Port 3000   │    │  Port 4000   │
    │  (Fastify) │     │  (Fastify)   │    │ (WebSocket)  │
    └────────────┘     └──────┬───────┘    └──────┬───────┘
                              │                   │
                        ┌─────▼───────────────────▼─────┐
                        │    SQLite Database            │
                        │  (shared volume)              │
                        └───────────────────────────────┘
```

---

## 🎮 WebSocket Message Protocol

### Client → Server
```typescript
// Join matchmaking queue
{ type: 'JOIN_QUEUE' }

// Leave queue
{ type: 'LEAVE_QUEUE' }

// Paddle movement (during game)
{ type: 'PADDLE_MOVE', direction: 'up' | 'down' | 'stop', timestamp: number }

// Ready to start
{ type: 'READY' }

// Heartbeat
{ type: 'PING', timestamp: number }
```

### Server → Client
```typescript
// Connection established
{ type: 'CONNECTED', userId: string }

// Match found
{ 
    type: 'MATCH_FOUND',
    roomId: string,
    opponent: string,
    yourRole: 'player1' | 'player2'
}

// Game state update (60 FPS)
{
    type: 'GAME_STATE',
    timestamp: number,
    ball: { x: number, y: number, vx: number, vy: number },
    paddle1: { y: number },
    paddle2: { y: number },
    score: { player1: number, player2: number }
}

// Game ended
{
    type: 'GAME_END',
    winner: 'player1' | 'player2',
    finalScore: { player1: number, player2: number }
}

// Opponent disconnected
{ type: 'OPPONENT_DISCONNECTED', reason: string }
```

---

## 📋 Implementation Checklist

### Phase 1: Database Schema
- [ ] Create migration script for database updates
- [ ] Add new columns to users table
- [ ] Create matches table
- [ ] Create active_games table
- [ ] Create matchmaking_queue table
- [ ] Test migrations

### Phase 2: Game Service Backend
- [ ] Create backend/Game_service directory structure
- [ ] Set up package.json with dependencies (ws, uuid, sqlite3)
- [ ] Create Dockerfile for game service
- [ ] Implement GameRoom.ts (ball physics, collision, scoring)
- [ ] Implement Matchmaker.ts (queue, pairing algorithm)
- [ ] Create WebSocket server (index.ts)
- [ ] Add game state persistence to database
- [ ] Implement reconnection logic

### Phase 3: Frontend WebSocket Client
- [ ] Create game.ts for WebSocket connection
- [ ] Implement "Find Match" button UI
- [ ] Create canvas rendering for game state
- [ ] Add keyboard input handlers (Arrow keys)
- [ ] Implement client-side interpolation for lag
- [ ] Add connection status indicators
- [ ] Create game end screen

### Phase 4: NGINX Configuration
- [ ] Add WebSocket proxy to nginx.conf (/ws endpoint)
- [ ] Configure upgrade headers
- [ ] Test WebSocket connection through proxy

### Phase 5: Docker Integration
- [ ] Add game-service to docker-compose.yml
- [ ] Configure shared volumes
- [ ] Set up service dependencies
- [ ] Test all services together

### Phase 6: Network Resilience
- [ ] Implement heartbeat/ping mechanism
- [ ] Add automatic reconnection logic
- [ ] Handle timeout scenarios
- [ ] Implement lag compensation
- [ ] Add graceful degradation

### Phase 7: Testing
- [ ] Test local matchmaking
- [ ] Test cross-network gameplay
- [ ] Simulate disconnections
- [ ] Test with high latency
- [ ] Load testing with multiple games

---

## 🔧 Key Implementation Files

### Game Service Entry Point
**backend/Game_service/index.ts** - See detailed code in chat history

### Game Room Logic
**backend/Game_service/src/GameRoom.ts** - Manages single match instance
- Ball physics (movement, collision, speed)
- Paddle collision detection
- Score tracking
- Win conditions
- Player input handling
- Disconnect recovery

### Matchmaking
**backend/Game_service/src/Matchmaker.ts** - Pairs waiting players
- Queue management
- Player pairing algorithm
- Game room creation
- Match notifications

### Frontend Client
**frontend/App/src/scripts/game.ts** - WebSocket client
- Connect to game server
- Send paddle inputs
- Receive and render game state
- Handle disconnections

### NGINX WebSocket Config
```nginx
location /ws {
    proxy_pass http://game_ws;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
}
```

---

## 📚 Dependencies to Install

### Game Service
```json
{
  "dependencies": {
    "ws": "^8.14.0",           // WebSocket library
    "@types/ws": "^8.5.8",     // TypeScript types
    "uuid": "^9.0.1",          // Room ID generation
    "sqlite3": "^5.1.7",       // Database
    "fastify": "^5.5.0"        // HTTP endpoints (optional)
  }
}
```

---

## 🚀 Game Physics Constants

```typescript
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 10;
const BALL_RADIUS = 5;
const BALL_INITIAL_SPEED = 5;
const BALL_SPEED_INCREMENT = 1.05; // Speed increases per paddle hit
const FPS = 60; // Game state updates per second
const WIN_SCORE = 11;
```

---

## 🎯 Subject Requirements Coverage

### Remote Players Module Requirements
✅ **Two players on different computers** - WebSocket architecture  
✅ **Same website access** - Through NGINX proxy  
✅ **Network issue handling:**
  - Unexpected disconnections → Opponent notification + game forfeit
  - Lag → Client-side prediction + server reconciliation
  - Timeouts → Heartbeat mechanism (ping/pong)
✅ **Best user experience:**
  - 60 FPS game state updates
  - Smooth interpolation
  - Connection status indicators
  - Automatic reconnection attempts

---

## 🔗 References

- Full implementation code available in chat history (November 7, 2025)
- All TypeScript code examples preserved above
- Database schema migrations documented
- Message protocol specifications included

---

## ⚠️ Important Notes

1. **Not yet implemented** - This is a planning document
2. **Backend framework** - You're using Node.js/Fastify (need Framework module justification)
3. **JWT authentication** - Should be implemented before multiplayer for user identification
4. **Testing strategy** - Test locally first, then across network
5. **Performance** - 60 FPS requires efficient code and good network

---

## 📞 Next Steps When Ready to Implement

1. Say "implement websocket multiplayer"
2. AI will create all files and configurations
3. Test services individually
4. Test integrated system
5. Deploy and validate

**Last Updated:** November 7, 2025  
**Status:** Checkpoint saved - Ready to test current services first
