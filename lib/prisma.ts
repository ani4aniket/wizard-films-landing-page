import { PrismaClient } from "@prisma/client"

import { loadProjectEnv } from "@/lib/load-env"

if (!process.env.DATABASE_URL) {
  loadProjectEnv()
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
