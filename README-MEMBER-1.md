# TeamFlow — Member 1 Auth Foundation

This branch contains only the project foundation and authentication responsibility for TeamFlow.

## Included

- React + Vite + TypeScript client foundation
- Express + TypeScript server foundation
- Prisma + PostgreSQL configuration
- Docker PostgreSQL 16
- JWT authentication using an HTTP-only cookie
- bcryptjs password hashing
- Zod authentication validation
- Register, login, logout, and current-user APIs
- JWT authentication middleware
- Admin role middleware
- Axios client with credentials enabled
- React authentication context and persistent `/api/auth/me` restore
- ProtectedRoute and AdminRoute
- Helmet, CORS, Morgan, centralized error handling
- Strict TypeScript configuration

## Start PostgreSQL

```bash
docker compose up -d postgres
```

## Configure server

Copy `server/.env.example` to `server/.env` and set a JWT secret with at least 32 characters.

## Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Prisma

```bash
npm run prisma:generate --prefix server
npm run prisma:migrate --prefix server -- --name init_auth
```

## Run

```bash
npm run dev
```

The API runs on `http://localhost:5000` and Vite runs on `http://localhost:5173`.

## Auth API

`POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass1",
  "role": "MEMBER"
}
```

`POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

`POST /api/auth/logout`

Clears the HTTP-only authentication cookie.

`GET /api/auth/me`

Requires the HTTP-only authentication cookie.

## Security

Passwords are never stored as plaintext. JWTs contain only `userId` and `role`. The JWT is stored in an HTTP-only cookie and is never exposed to browser JavaScript. Production cookies use `secure=true`.
