# CraftConnect Frontend

This README documents the frontend application in `app/`.

For backend-specific details such as routes, Prisma, database setup, and server scripts, see `../api/README.md`.

## What This App Does

The frontend is the client-facing interface for CraftConnect, a service marketplace for booking local artisans. It handles:

- public browsing and search
- authentication UI
- booking creation flow
- customer and artisan dashboard screens
- live data loading from the backend API

## How It Works

The frontend does not talk directly to PostgreSQL. It sends HTTP requests to the backend API, which applies business logic and persists data through Prisma.

Flow:

```text
React frontend -> Express API -> Prisma -> PostgreSQL
```

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI
- GSAP

## Important Frontend Areas

- `src/pages/`: route-level pages
- `src/features/`: domain logic, hooks, and API clients
- `src/components/`: shared UI components
- `src/lib/api.ts`: shared fetch wrapper for backend calls
- `src/types/`: frontend data contracts

## Environment

Required `app/.env`:

```env
VITE_API_BASE_URL="http://localhost:4000"
```

## Local Development

From `app/`:

```bash
npm install
npm run dev
```

Frontend development server:

- `http://localhost:5173`

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: build the production bundle
- `npm run lint`: run ESLint
- `npm run preview`: preview the production build

## Deployment

The recommended hosted deployment for this project is:

- frontend on Vercel
- backend on Render
- database on Neon Postgres

For the full step-by-step process, see [c:/Users/Syntra/Downloads/CraftConnect/DEPLOYMENT.md](c:/Users/Syntra/Downloads/CraftConnect/DEPLOYMENT.md).

Frontend-specific Vercel settings:

- Framework Preset: `Vite`
- Root Directory: `app`
- Environment Variable: `VITE_API_BASE_URL=https://your-render-service.onrender.com`

This app already includes [c:/Users/Syntra/Downloads/CraftConnect/app/vercel.json](c:/Users/Syntra/Downloads/CraftConnect/app/vercel.json) for SPA route rewrites.

## Current Behavior

- The frontend is API-only now. Demo/mock fallback mode has been removed.
- If the database has no users, artisan profiles, or bookings yet, the UI will render empty states instead of demo content.
- The backend must be running for authentication, artisan search, and booking flows to work.

## Related Docs

- Backend setup and API details: `../api/README.md`
- Hosted deployment guide: [c:/Users/Syntra/Downloads/CraftConnect/DEPLOYMENT.md](c:/Users/Syntra/Downloads/CraftConnect/DEPLOYMENT.md)
