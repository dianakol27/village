# Validation module

The activity discovery URL boundary is validated and normalized in `src/lib/activities/discovery.ts` with Zod. Add schemas close to the domain behavior they validate, and share them with other entry points when those flows are introduced.
