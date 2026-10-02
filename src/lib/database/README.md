# Database module

`prisma.ts` is the server-only Prisma 7 client singleton using the PostgreSQL driver adapter. Keep Prisma imports in server-side data access modules; routes should call domain-oriented queries rather than constructing Prisma queries inline. The relational model and migrations live under the root `prisma/` directory.
