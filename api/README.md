# CraftConnect API

Express + Prisma backend for CraftConnect.

## 1. Configure environment

Copy `.env.example` to `.env` and set your PostgreSQL connection string.

```
PORT=4000
DATABASE_URL="postgresql://craft_user:change_this_password@localhost:5432/craftconnect"
CORS_ORIGIN="http://localhost:5173"
SESSION_COOKIE_NAME="cc_session"
SESSION_COOKIE_SECURE="false"
```

## 2. Install and generate client

```bash
npm install
npm run prisma:generate
```

## 3. Create tables and seed data

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

## 4. Run API

```bash
npm run dev
```

## Demo users after seed

- `customer@example.com` / `password123`
- `maria@example.com` / `password123`
- `admin@example.com` / `password123`

## Frontend env

Set these in `app/.env`:

```
VITE_API_BASE_URL="http://localhost:4000"
VITE_AUTH_MODE="api"
VITE_DATA_MODE="api"
```
