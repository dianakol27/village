# Architecture overview

Village uses a modular monolith: one Next.js application, with domain logic kept independent from route and presentation code. This keeps the initial deployment simple while leaving clear boundaries as the product grows.

## Application layers

```text
src/app/                 App Router pages, layouts, and route handlers
src/components/           Domain-focused UI and shared shadcn/ui components
src/lib/                  Services, validation, and domain rules
prisma/                   PostgreSQL schema and migration history
```

The App Router layer should translate web requests into application calls and render results. Components should focus on presentation and user interaction. Business rules should live in `src/lib/`, with external systems accessed through narrow modules rather than from UI components.

## Module responsibilities

- `lib/database/`: Prisma client lifecycle and persistence access. `prisma.ts` is server-only and owns the adapter-backed Prisma singleton.
- `lib/auth/`: authentication integration and session boundaries. No provider or auth flow is selected yet.
- `lib/validation/`: Zod schemas for request and form boundaries.
- `lib/ai/`: future AI provider integration, isolated from product rules.
- `lib/recommendations/`: ranking and recommendation rules independent of UI and provider APIs.
- `lib/geolocation/`: location parsing, distance helpers, and future geocoding integration.
- `components/activities/`, `children/`, `circles/`, and `map/`: product-domain UI areas.
- `components/shared/`: reusable product UI that is not tied to one domain.
- `components/ui/`: generated and adapted shadcn/ui primitives.

## Data flow guidance

Validate untrusted input at route, action, and integration boundaries. Keep persistence and provider-specific types inside their owning modules; expose application-focused types to route and UI code. Do not make network, database, or AI calls from presentational components.

## Quality checks

Use `npm run lint` and `npm run typecheck` during development. Add fast unit tests with Vitest close to the code they cover, and use Playwright for user-visible flows. Database tests should use an explicitly provisioned test database rather than production credentials.

## Current scope

The public home page presents the Village identity and future product experiences using local, typed mock data. `/explore` and `/activities/[slug]` read published activities and upcoming sessions from PostgreSQL through the server-only `lib/activities/queries.ts` module. Deterministic URL parsing and age, audience, date, and price rules live in `lib/activities/discovery.ts`. There is no authentication, booking, AI search, map, distance filtering, or Circles product flow yet.
