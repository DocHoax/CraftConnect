# CraftConnect Backend

This README documents the backend application in `api/`.

For frontend-specific details such as pages, UI behavior, and client setup, see `../app/README.md`.

## What This Service Does

The backend provides the API and persistence layer for CraftConnect. It is responsible for:

- authentication and session management
- artisan, category, and booking endpoints
- request validation and role-based authorization
- database persistence through Prisma and PostgreSQL

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- bcryptjs
- cookie-parser
- cors

## Architecture Role

This service sits between the React frontend and PostgreSQL.

Flow:

```text
Frontend -> REST API -> Prisma -> PostgreSQL
```

The frontend never connects directly to PostgreSQL or pgAdmin4.

## Important Backend Areas

- `src/server.ts`: Express bootstrap and middleware wiring
- `src/routes/`: route handlers for auth, artisans, bookings, and categories
- `src/middleware/`: auth, rate limiting, and error handling
- `src/lib/`: Prisma client, session helpers, and async utilities
- `prisma/schema.prisma`: database schema
- `prisma/migrations/`: migration history
- `prisma/seed.ts`: reference data seeding

## API Surface

Main route groups:

- `/health`: service health check
- `/auth`: login, register, logout, session lookup
- `/categories`: list artisan categories
- `/artisans`: list artisans, fetch artisan details, fetch reviews
- `/bookings`: create bookings, list bookings, fetch details, update booking status

## Environment

Copy `.env.example` to `.env` and set the values.

Current local example:

```env
PORT=4000
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/craftconnect"
CORS_ORIGIN="http://localhost:5173"
SESSION_COOKIE_NAME="cc_session"
SESSION_COOKIE_SECURE="false"
```

## Database Notes

- PostgreSQL is the system of record.
- Prisma manages the schema and database access.
- The active local database is `craftconnect` on `127.0.0.1:5432`.
- Seed behavior now ensures reference categories only. Demo users, bookings, and reviews are no longer inserted by default.

## Local Development

From `api/`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Backend development server:

- `http://localhost:4000`

Health endpoint:

- `http://localhost:4000/health`

## Scripts

- `npm run dev`: start the API in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run the compiled server
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run development migrations
- `npm run prisma:seed`: ensure reference categories exist

## Deployment

The repository now includes a root-level Docker Compose deployment in `../docker-compose.yml`.

The compose stack runs:

- PostgreSQL
- the API service
- the frontend service

Deployment flow:

1. PostgreSQL starts inside the compose network.
2. The API waits for the database health check.
3. The API runs `prisma migrate deploy` and `npm run prisma:seed` on startup.
4. The frontend is served by Nginx and talks to the API on `http://localhost:4000`.

From the repository root:

```bash
docker compose up --build
```

Exposed services:

- frontend: `http://localhost:8080`
- API: `http://localhost:4000`

Notes:

- the compose PostgreSQL service is internal-only and is not published to a host port
- this avoids conflicts with any PostgreSQL instance already running on your machine
- if you deploy to a real HTTPS host, review cookie security settings and `CORS_ORIGIN`

## Frontend Integration

The frontend must point to this API through `app/.env`:

```env
VITE_API_BASE_URL="http://localhost:4000"
```

## Current Behavior

- The backend supports live authentication, artisan lookup, category loading, booking creation, and booking status updates.
- The frontend now depends entirely on this service; there is no mock/demo API path anymore.
- If the database is empty apart from categories, the API will return valid empty collections rather than sample data.

## Related Docs

- Frontend application README: `../app/README.md`
