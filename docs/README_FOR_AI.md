# 🤖 README for AI Assistant

**Purpose:** This file helps AI assistants quickly understand the project state when opening this workspace from a different machine.

---

## 📌 Project Context

**Project Name:** ft_transcendence (ULTRAPONG)  
**Type:** Multiplayer Pong game with microservices architecture  
**Tech Stack:** Docker, Node.js, TypeScript, Fastify, SQLite, NGINX, TailwindCSS  
**Status:** In development - Planning phase complete

---

## 🗂️ Important Documentation Files

**READ THESE FIRST when resuming:**

1. **`WEBSOCKET_MULTIPLAYER_PLAN.md`** (root directory)
   - Complete WebSocket implementation plan
   - Database schemas
   - Code examples for Game Service
   - Message protocols
   - Architecture diagrams

2. **`docs/CHAT_HISTORY_NOV_7_2025.md`**
   - Full conversation history
   - All questions asked and answered
   - Design decisions made
   - Context from previous sessions

3. **This file** - Quick reference for AI

---

## 🏗️ Current Architecture

```
NGINX (Port 8443, SSL/TLS)
├── /signin → login-service:3000 (Authentication)
└── / → frontend:3000 (Game UI)

Database: SQLite (shared volume)
```

**Services:**
- `frontend` - Game UI (Fastify, TypeScript, TailwindCSS)
- `login-service` - Authentication API (Fastify, SQLite)
- `nginx` - Reverse proxy with SSL

**Planned:**
- `game-service` - WebSocket server for multiplayer (not yet created)

---

## ⚠️ Known Issues & Decisions

**Security Issues (Not Yet Fixed):**
- ❌ No JWT authentication
- ❌ Passwords stored in plaintext (no bcrypt)
- ❌ No route protection
- ❌ CORS wide open
- ❌ Login validation not implemented

**Subject Compliance:**
- Using Node.js/Fastify (requires Framework module justification)
- Not using pure PHP (default requirement)

**Ports Changed:**
- Originally 80/443 → Changed to 8080/8443 (permission issues)

---

## 📋 Implementation Status

**Completed:**
- ✅ Docker setup
- ✅ NGINX with SSL
- ✅ Basic database schema
- ✅ Frontend UI (login/register forms)
- ✅ Service structure
- ✅ Planning documentation

**Not Implemented:**
- ⬜ JWT authentication
- ⬜ Password hashing
- ⬜ Pong game logic
- ⬜ WebSocket multiplayer
- ⬜ Matchmaking system
- ⬜ Tournament system
- ⬜ Canvas game rendering

---

## 🚀 Quick Start Commands

**Start Services:**
```bash
cd /path/to/ft_trascendence
docker-compose up -d
docker-compose logs -f
```

**Check Status:**
```bash
docker ps
docker images
```

**Access:**
- HTTPS: https://localhost:8443
- HTTP: http://localhost:8080

---

## 🎯 Next Steps (User's Intent)

**Immediate Priority:**
1. Test current services
2. Implement JWT authentication
3. Build basic Pong game (local multiplayer)
4. Add WebSocket for remote multiplayer

**User Wants:**
- Multiplayer Pong with WebSockets
- Different clients on different PCs
- Handle network issues (disconnects, lag)
- Tournament/matchmaking system

---

## 💾 Database Schema

**Current:**
```sql
users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT  -- ⚠️ plaintext!
)
```

**Planned Extensions:** See `WEBSOCKET_MULTIPLAYER_PLAN.md` for:
- matches table
- active_games table
- matchmaking_queue table
- user stats (wins, losses, etc.)

---

## 🗣️ How to Help User

**When user returns:**

1. **Acknowledge context:**
   "Welcome back! I see from your documentation that we were working on the ft_transcendence multiplayer Pong game. We created a WebSocket implementation plan last session."

2. **Reference docs:**
   "I've read your WEBSOCKET_MULTIPLAYER_PLAN.md and chat history. You have the architecture planned but not yet implemented."

3. **Ask intent:**
   "Would you like to:
   - Test your current services?
   - Implement JWT authentication?
   - Build the WebSocket Game Service?
   - Start with basic Pong game logic?"

4. **Be proactive:**
   - Offer to implement based on existing plans
   - Reference specific sections of documentation
   - Don't ask questions already answered in docs

---

## 📚 Code References

**All implementation code examples are in:**
- `WEBSOCKET_MULTIPLAYER_PLAN.md`

Including:
- GameRoom.ts (complete implementation)
- Matchmaker.ts (queue system)
- WebSocket server setup
- Frontend WebSocket client
- NGINX configuration
- Database migrations

**Don't recreate these - reference the existing plan!**

---

## 🔧 Environment

**Files:**
- `secrets/.env` - Environment variables (created)
- SSL certs in `nginx/certs/`
- Database at `backend/Login_service/data/database.db`

**Docker Images Built:**
- trasc-frontend (1.59GB)
- trasc-login-service (280MB)
- trasc-nginx (13.7MB)

---

## 🎯 User's Learning Goals

User wanted to understand:
- ✅ Backend vs no backend
- ✅ Matchmaking systems
- ✅ Tournament structure
- ✅ WebSocket architecture
- ✅ Network issue handling

**All explained in chat history.**

---

## 📞 Quick Commands for User

**Test services:**
```bash
docker-compose up -d && docker-compose logs -f
```

**Implement WebSocket (when ready):**
Just say: "implement websocket multiplayer"

**Implement JWT (when ready):**
Just say: "implement JWT authentication"

---

**Last Updated:** November 7, 2025  
**Session:** Planning complete, implementation pending  
**Checkpoint Files:** WEBSOCKET_MULTIPLAYER_PLAN.md, CHAT_HISTORY_NOV_7_2025.md
