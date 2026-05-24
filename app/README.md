# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # CraftConnect

  CraftConnect is a full-stack service marketplace for booking local artisans. Customers can search for providers, view profiles, create bookings, and manage their appointments. Artisans can register, receive booking requests, and update job status through the platform.

  This repository is split into two apps:

  - `app/`: the React frontend
  - `api/`: the Express + Prisma backend

  ## Why This Project Was Built

  CraftConnect was built to make artisan discovery and booking simpler and more transparent. Instead of relying on informal referrals or disconnected messaging, the platform brings search, profile discovery, booking, and status management into one workflow.

  The product goal is to provide:

  - a searchable marketplace for local service providers
  - a structured booking flow for customers
  - a dashboard experience for customers, artisans, and admins
  - a persistent backend connected to PostgreSQL instead of in-browser mock storage

  ## What The Project Does

  At a high level, CraftConnect allows users to:

  - browse artisan categories and search live artisan profiles
  - sign up and log in through the backend API
  - create and manage bookings
  - update booking state as a customer or artisan
  - persist application data in PostgreSQL

  ## How It Works

  The system uses a standard client-server architecture:

  1. The frontend sends HTTP requests to the backend API.
  2. The backend validates input, applies business rules, and reads or writes data through Prisma.
  3. Prisma persists the data in PostgreSQL.
  4. The frontend renders live results returned by the API.

  The website does not connect directly to PostgreSQL or pgAdmin4.

  The real data flow is:

  ```text
  React frontend -> Express API -> Prisma ORM -> PostgreSQL
  ```

  pgAdmin4 is only an administration tool used to inspect the database manually.

  ## Frontend

  The frontend lives in `app/` and is built with React, TypeScript, and Vite.

  Key responsibilities:

  - render the public landing page and search experience
  - handle authentication flows
  - load artisan, category, and booking data from the API
  - provide dashboards for different user roles
  - manage client-side navigation and UI state

  Important frontend areas:

  - `src/pages/`: route-level screens
  - `src/features/`: feature-specific API clients, hooks, and logic
  - `src/components/`: reusable UI and layout pieces
  - `src/lib/api.ts`: shared API request helper

  ## Backend

  The backend lives in `api/` and is built with Express, TypeScript, Prisma, and PostgreSQL.

  Key responsibilities:

  - authenticate users and manage sessions
  - expose REST endpoints for auth, artisans, categories, and bookings
  - validate request payloads with Zod
  - enforce role-based booking access rules
  - persist data in PostgreSQL through Prisma

  Important backend areas:

  - `src/routes/`: API endpoints
  - `src/middleware/`: auth, rate limiting, and error handling
  - `src/lib/`: Prisma client, sessions, and shared utilities
  - `prisma/schema.prisma`: database schema
  - `prisma/migrations/`: database migration history

  ## Tech Stack

  ### Frontend

  - React 19
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Radix UI primitives
  - GSAP for animation

  ### Backend

  - Node.js
  - Express
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - Zod
  - bcryptjs
  - cookie-based session handling

  ## Database

  The backend is configured to use PostgreSQL through Prisma.

  Current local setup:

  - database host: `127.0.0.1`
  - database port: `5432`
  - database name: `craftconnect`

  The application now uses live database-backed data only. The old mock/demo paths were removed from the frontend, and demo seed users/bookings were removed from the active database setup.

  At the moment, the database keeps reference categories but does not include sample users, artisan profiles, or bookings by default. That means the UI will look empty until real records are created.

  ## Current Product State

  The project currently supports:

  - live authentication via backend API
  - live artisan/category loading from PostgreSQL
  - live booking creation and status updates
  - customer and artisan dashboard flows

  Areas that still need expansion if the product is moving toward production:

  - richer artisan onboarding and profile editing
  - persisted payment records instead of simulated payment UI only
  - review creation from the frontend
  - admin tooling beyond basic dashboard views
  - stronger test coverage and production deployment configuration

  ## Project Structure

  ```text
  CraftConnect/
    api/
      prisma/
      src/
        lib/
        middleware/
        routes/
    app/
      public/
      src/
        components/
        features/
        lib/
        pages/
        types/
  ```

  ## Local Development

  ### Prerequisites

  - Node.js and npm
  - PostgreSQL
  - a database named `craftconnect`

  ### Backend setup

  From `api/`:

  ```bash
  npm install
  npm run prisma:generate
  npm run prisma:migrate -- --name init
  npm run prisma:seed
  npm run dev
  ```

  Required backend environment variables in `api/.env`:

  ```env
  PORT=4000
  DATABASE_URL="postgresql://postgres@127.0.0.1:5432/craftconnect"
  CORS_ORIGIN="http://localhost:5173"
  SESSION_COOKIE_NAME="cc_session"
  SESSION_COOKIE_SECURE="false"
  ```

  ### Frontend setup

  From `app/`:

  ```bash
  npm install
  npm run dev
  ```

  Required frontend environment variables in `app/.env`:

  ```env
  VITE_API_BASE_URL="http://localhost:4000"
  ```

  ## Available Scripts

  ### Frontend scripts

  - `npm run dev`: start Vite development server
  - `npm run build`: create a production build
  - `npm run lint`: run ESLint
  - `npm run preview`: preview the production build

  ### Backend scripts

  - `npm run dev`: start the API in watch mode
  - `npm run build`: compile TypeScript
  - `npm run start`: run the built server
  - `npm run prisma:generate`: generate Prisma client
  - `npm run prisma:migrate`: run Prisma development migrations
  - `npm run prisma:seed`: ensure reference seed data exists

  ## API Overview

  Main backend route groups:

  - `/auth`: login, registration, session lookup, logout
  - `/categories`: category listing
  - `/artisans`: artisan listing, detail, reviews
  - `/bookings`: booking listing, creation, detail, status updates
  - `/health`: service health check

  ## Notes For Reviewers

  - The frontend and backend are developed as separate apps in the same workspace.
  - The frontend now expects the backend to be available; there is no demo fallback mode anymore.
  - If no artisans or users exist in PostgreSQL, pages will render correctly but with empty live states.

  ## Summary

  CraftConnect is a full-stack artisan booking platform built to replace mock/demo flows with a real PostgreSQL-backed workflow. The frontend provides the user experience, the backend enforces application rules, and PostgreSQL stores the persistent data that powers the platform.
