import "server-only";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";

const globalForPrisma = globalThis as typeof globalThis & {
  cachedPrisma?: PrismaClient;
};

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return url;
}

const sqliteAdapter = new PrismaBetterSqlite3({
  url: resolveDatabaseUrl(),
});

export const prisma =
  globalForPrisma.cachedPrisma ??
  new PrismaClient({
    adapter: sqliteAdapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.cachedPrisma = prisma;
}
