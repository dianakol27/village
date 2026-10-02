import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Village's database-backed routes.");
}

const globalForPrisma = globalThis as unknown as { villagePrisma?: PrismaClient };

const createPrismaClient = () =>
  new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

export const prisma = globalForPrisma.villagePrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.villagePrisma = prisma;
}
