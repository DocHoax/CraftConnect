# CraftConnect Deployment Guide

This project is prepared for the following deployment split:

- frontend: Vercel
- backend: Render
- database: Neon Postgres

## Deployment Order

Use this order:

1. Create the Neon PostgreSQL database.
2. Deploy the backend to Render.
3. Deploy the frontend to Vercel.
4. Update backend CORS to the final Vercel URL.

This order avoids guessing production URLs too early.

## 1. Neon Postgres

Create a Neon project and database, then copy the database connection string.

Important:

- use the direct PostgreSQL connection string from Neon
- include SSL as provided by Neon
- use that value for `DATABASE_URL` on Render

The backend expects a `craftconnect` schema layout managed by Prisma migrations.

## 2. Render Backend

Create a new Web Service on Render connected to this repository.

If you use the included Render Blueprint, most environment variables are already prefilled. In the Render dashboard form, you only need to supply the values marked as secret or environment-specific.

Recommended settings:

- Root Directory: `api`
- Runtime: `Node`
- Build Command: `npm install && npm run prisma:generate && npm run build`
- Start Command: `npx prisma migrate deploy && npm run prisma:seed && npm run start`

You can also use the included [render.yaml](c:/Users/Syntra/Downloads/CraftConnect/render.yaml).

Set these environment variables on Render:

```env
PORT=4000
DATABASE_URL=<your-neon-direct-connection-string>
CORS_ORIGIN=http://localhost:5173
SESSION_COOKIE_NAME=cc_session
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=none
TRUST_PROXY=true
```

If you deploy from the Render form instead of the Blueprint, enter the same values there. For the Environment Variables page shown in the screenshot, add:

```env
DATABASE_URL=<your-neon-direct-connection-string>
CORS_ORIGIN=http://localhost:5173
```

Then replace `CORS_ORIGIN` with your final Vercel URL after the frontend is live.

Notes:

- `CORS_ORIGIN` is temporary at first. Replace it with the real Vercel URL after the frontend is deployed.
- `SESSION_COOKIE_SECURE=true` is required for cross-site cookies over HTTPS.
- `SESSION_COOKIE_SAME_SITE=none` is required because Vercel and Render are different origins.
- `TRUST_PROXY=true` is recommended on Render.

After deployment, note the Render backend URL. Example:

```text
https://craftconnect-api.onrender.com
```

Check the health endpoint:

```text
https://your-render-service.onrender.com/health
```

## 3. Vercel Frontend

Create a Vercel project from this repository.

Recommended settings:

- Framework Preset: `Vite`
- Root Directory: `app`

Set this environment variable on Vercel:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

The repository already includes [app/vercel.json](c:/Users/Syntra/Downloads/CraftConnect/app/vercel.json) so client-side routes resolve correctly for the SPA.

Deploy the project, then copy the final Vercel domain. Example:

```text
https://craftconnect.vercel.app
```

## 4. Update Render CORS

Go back to Render and replace the temporary `CORS_ORIGIN` value with your real Vercel URL.

Example:

```env
CORS_ORIGIN=https://craftconnect.vercel.app
```

Redeploy the Render service after saving the environment change.

## 5. Verify Production Flow

After both services are live:

1. Open the Vercel frontend.
2. Load artisan categories.
3. Register a real account.
4. Confirm that requests reach the Render API.
5. Check Neon to confirm rows are created.

## Environment Summary

### Vercel

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

### Render

```env
PORT=4000
DATABASE_URL=<your-neon-direct-connection-string>
CORS_ORIGIN=https://your-vercel-domain.vercel.app
SESSION_COOKIE_NAME=cc_session
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=none
TRUST_PROXY=true
```

## Notes

- The frontend no longer contains demo/mock fallback mode.
- The backend seed now ensures reference categories only.
- If Neon has no users or artisans yet, the frontend will show empty live states until real data is created.
- If authentication cookies do not persist, recheck `CORS_ORIGIN`, `SESSION_COOKIE_SECURE`, and `SESSION_COOKIE_SAME_SITE` first.
