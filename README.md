# HexaHosting

HexaHosting is a Next.js website for showcasing Minecraft hosting services. It includes marketing pages, a basic auth flow, and API routes backed by Prisma + SQLite.

## Overview

- Next.js 16 App Router project with React 19 and TypeScript
- Tailwind CSS 4 styling and shadcn/ui-based component setup
- Prisma 7 with SQLite for local user storage
- API routes for register, login, and contact health check
- Biome for linting and formatting

## Tech Stack

- Framework: [Next.js](https://nextjs.org) 16
- UI: [React](https://react.dev) 19
- Language: [TypeScript](https://www.typescriptlang.org)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- Components: [shadcn/ui](https://ui.shadcn.com)
- ORM: [Prisma](https://www.prisma.io) 7
- Database: SQLite
- Linting/Formatting: [Biome](https://biomejs.dev)
- Package Manager: [pnpm](https://pnpm.io)

## Prerequisites

- Node.js 18+
- pnpm 8+

## Setup

```bash
git clone https://github.com/S0FTS0RR0W/HexaHosting-Site.git
cd HexaHosting-Site
pnpm install
```

Create a `.env` file:

```bash
DATABASE_URL="file:./dev.db"
AUTH_TOKEN_SECRET="replace-with-a-long-random-secret"
```

Optional admin credentials (can log in without DB user creation):

```bash
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me"
```

## Development

```bash
pnpm db:generate
pnpm db:migrate
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome checks
pnpm format       # Format with Biome
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run local migrations
pnpm db:studio    # Open Prisma Studio
```

## Routes

Pages:

- `/`
- `/about`
- `/blog`
- `/contact`
- `/login`
- `/status`

API:

- `POST /api/register`
- `POST /api/login`
- `GET /api/contact`

## Authentication Notes

- Auth responses set an HTTP-only cookie named `hexa_auth`.
- Tokens are signed with `AUTH_TOKEN_SECRET`.
- In non-production environments, if `AUTH_TOKEN_SECRET` is missing, a fallback secret is used.
- In production, `AUTH_TOKEN_SECRET` is required.

## Database

Prisma schema currently includes a `User` model with:

- `id`
- `name`
- `email` (unique)
- `passwordHash`
- `createdAt`
- `updatedAt`

Migrations are tracked in `prisma/migrations` and should be committed.

## Project Structure

```text
app/                 Next.js routes and API endpoints
components/          Shared React components
components/ui/       UI primitives
lib/                 Utilities, Prisma client, auth logic
prisma/              Prisma schema and migrations
assets/              Project media assets
public/              Static public files
```

## Deployment

This project can be deployed on Vercel or any platform that supports Next.js.

Standard production flow:

```bash
pnpm build
pnpm start
```

## License

This repository is private and owned by HexaHosting.
