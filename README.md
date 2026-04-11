# Project ATLAS — Gamified 3D Learning OS

Monorepo: **React 18 + R3F + Tailwind + Zustand** (`client`, port **3000**) and **Express + Mongoose** (`server`, port **5000**).

## Prerequisites

- Node.js 18+
- MongoDB at `mongodb://localhost:27017` (database name `atlas_beast`)

## Setup

```bash
npm install
```

### Server

```bash
cp server/.env.example server/.env
# edit server/.env if needed
npm run dev --workspace=server
```

### Client

Optional: in `client/.env` use Vite-prefixed vars (or keep `REACT_APP_GEMINI_API_KEY` for Gemini — the app reads both):

- `VITE_GEMINI_API_KEY` — optional Gemini
- `VITE_SPOTIFY_PLAYLIST_URL` — optional Spotify embed URL

```bash
npm run dev --workspace=client
```

### Both

```bash
npm install
npm run dev
```

Requires `concurrently` (installed at root via `npm install`).

## API

- `GET/POST /api/tasks`
- `GET/PATCH/DELETE /api/tasks/:id`
- `GET /api/health`

The Vite dev server proxies `/api` to `http://localhost:5000`.
