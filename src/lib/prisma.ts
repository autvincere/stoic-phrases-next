import { PrismaClient } from '../generated/prisma';

// Evita crear múltiples instancias de Prisma Client en desarrollo
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

// Añadir tipado global para prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Detectar el entorno actual
const env = process.env.NODE_ENV || 'development';
console.log(`[Prisma] Inicializando en entorno: ${env}`);
console.log(
  `[Prisma] DATABASE_URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'No definida'}`,
);

// Asegurarse de que no usemos credenciales equivocadas accidentalmente
// Solo en desarrollo local, no en test (CI)
if (
  env === 'development' &&
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.includes('test_user') &&
  !process.env.CI // No aplicar en CI
) {
  console.warn(
    '[Prisma] ⚠️ ADVERTENCIA: Estás usando credenciales de test en entorno de desarrollo',
  );
  console.warn('[Prisma] Corrigiendo DATABASE_URL para desarrollo');
  process.env.DATABASE_URL = 'postgresql://postgres:123456@localhost:5432/phrases_db';
}

let prisma: PrismaClient;

if (env === 'test') {
  // Para tests, usamos una instancia específica que sí conecta a la BD de test
  console.log('[Prisma] Usando configuración para TESTS');
  console.log(`[Prisma] DATABASE_URL en test: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'No definida'}`);
  prisma = new PrismaClient();
} else if (env === 'production') {
  // En producción, siempre creamos una nueva instancia
  console.log('[Prisma] Usando configuración de PRODUCCIÓN');
  prisma = new PrismaClient();
} else {
  // En desarrollo, reutilizamos una instancia global
  console.log('[Prisma] Usando configuración de DESARROLLO');
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log('[Prisma] Creando nueva instancia de desarrollo');
  } else {
    console.log('[Prisma] Reutilizando instancia de desarrollo existente');
  }
  prisma = global.prisma;
}

export default prisma;
