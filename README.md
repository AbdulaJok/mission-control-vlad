# 🚀 Mission Control

OpenClaw Dashboard — Tasks, Memory, Calendar, Team, Office.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and add your credentials:
     - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` (from GitHub OAuth)
     - `CONVEX_DEPLOYMENT` (from `npx convex dev`)
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

3. **Run Convex Backend:**
   ```bash
   npx convex dev
   ```
   (Keep this running in a separate terminal)

4. **Run Next.js Frontend:**
   ```bash
   npm run dev
   ```

5. **Open:** http://localhost:3000

## Structure

- `app/tasks` — Tasks Board (Todo/In Progress/Done)
- `app/memory` — Memory Vault (Searchable insights)
- `convex/` — Backend schema & functions
- `.env.local` — **Your secrets (DO NOT COMMIT)**
