import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Tenant-scoped query guard
 * Helper function ensuring tenant isolation
 */
export function tenantWhere<T extends Record<string, any>>(schoolId: string, filter?: T): T & { schoolId: string } {
  return {
    ...filter,
    schoolId,
  } as T & { schoolId: string };
}
