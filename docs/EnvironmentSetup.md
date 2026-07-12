# Environment Setup Guide

Follow these steps to configure your local setup.

## 📋 Environment Variables

Create `.env` inside `apps/api/` matching `apps/api/.env.example`:

| Key                    | Description                                   | Default / Example                                                        |
| :--------------------- | :-------------------------------------------- | :----------------------------------------------------------------------- |
| `PORT`                 | API server port                               | `5000`                                                                   |
| `DATABASE_URL`         | PostgreSQL connection string                  | `postgresql://postgres:postgres@localhost:5432/transitops?schema=public` |
| `JWT_SECRET`           | Secret token to sign short-lived access JWTs  | `super-secret-access-token-key-change-in-production`                     |
| `JWT_REFRESH_SECRET`   | Secret token to sign refresh JWTs             | `super-secret-refresh-token-key-change-in-production`                    |
| `ACCESS_TOKEN_EXPIRY`  | Access token lifespan                         | `15m`                                                                    |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifespan                        | `7d`                                                                     |
| `NODE_ENV`             | Environment state                             | `development`                                                            |
| `CLIENT_URL`           | Expected client origin for CORS configuration | `http://localhost:3000`                                                  |

---

## 🏃 Running in Development Mode

1. **PostgreSQL raw SQL migration & seed setup:**
   Ensure database is running and `DATABASE_URL` is set, then run:

   ```bash
   # From root
   npm run db:migrate --workspace=@transitops/api
   npm run db:seed --workspace=@transitops/api
   ```

2. **Start Dev Server:**
   Launch both Express and Next.js concurrently:
   ```bash
   npm run dev
   ```
   - **Express Server URL:** `http://localhost:5000`
   - **Next.js Client URL:** `http://localhost:3000`
