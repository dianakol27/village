# Village

Village is a mobile-first local discovery and community platform for parents of young children. It brings together activities for kids, time for parents, and small local communities.

The current `/` route is a public brand and product landing page. Its activity and community examples are typed fictional mock data used only to demonstrate the future product experience. Product flows, authentication, database models, recommendations, AI, maps, and bookings are not implemented.

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```sh
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The current app does not require a running PostgreSQL instance to start.

## Common commands

```sh
npm run dev          # Start the Next.js development server
npm run build        # Create a production build
npm run start        # Serve a production build
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript types
npm test             # Run Vitest
npm run test:e2e     # Run Playwright browser tests
npm run db:generate  # Generate Prisma Client after schema changes
npm run db:migrate   # Apply development migrations
```

Vitest and Playwright are configured but no product tests have been added yet. Playwright's browser binaries can be installed with `npx playwright install` when browser tests are introduced.

## Architecture

- `src/app/` contains Next.js App Router routes, layouts, and global styles.
- `src/components/` is organized by product domain; shared landing-page components live in `shared/` and reusable shadcn/ui primitives belong in `ui/`.
- `src/lib/` holds framework-independent services and domain logic. Its database, authentication, validation, AI, recommendations, and geolocation areas are reserved for future implementation.
- `src/lib/landing-page-data.ts` contains the typed fictional examples used by the public landing page, separate from its presentation components.
- `prisma/` contains the PostgreSQL Prisma schema and migrations. The schema intentionally has no models yet.
- `docs/` records architecture and technical decisions.
- `e2e/` is the Playwright test location; Vitest tests belong beside source files as `*.test.ts` or `*.test.tsx`.

Keep route components focused on composing page sections. Put reusable UI in `components/` and business rules in `lib/`. Validate untrusted input at boundaries with Zod. Keep database access behind the database module, and keep provider-specific concerns out of domain logic.

## Foundation choices

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS 4 with shadcn/ui configuration and component aliases
- ESLint using the Next.js Core Web Vitals and TypeScript presets
- PostgreSQL-ready Prisma 7 setup with the `pg` driver adapter
- Zod for future boundary validation
- Vitest for unit and integration tests; Playwright for browser-level end-to-end tests

See [the architecture overview](docs/architecture.md), [technical decisions](docs/decisions/README.md), and [visual architecture decisions](docs/decisions.md) for the planned boundaries and rationale.
