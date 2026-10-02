# 0001: Start as a modular monolith

- Status: Accepted
- Date: 2026-10-02

## Context

Village is an early product with several expected domains, but no product workflows or operational boundaries have been validated yet. Separate services would add deployment and data coordination costs before they solve a demonstrated problem.

## Decision

Start with one Next.js application and keep domain logic in explicit modules under `src/lib/`. Keep UI organized by domain under `src/components/` and access PostgreSQL through the database module.

## Consequences

The project has one straightforward development and deployment path. Modules can be extracted later if ownership, scale, or reliability needs justify it. Module boundaries need to be respected so the application does not become a tightly coupled monolith.
