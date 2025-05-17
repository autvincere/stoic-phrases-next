import { PrismaClient } from '@prisma/client';

// Analizar la conexión de base de datos (ya cargada por dotenv-cli)
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/phrases_db';
console.log(`[Prisma] URL de la base de datos: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);

// Configuración de Prisma
const prismaConfig = {
  datasources: {
    db: {
      url: dbUrl,
    },
  },
};

// Gestión de instancias (singleton)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig);
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
