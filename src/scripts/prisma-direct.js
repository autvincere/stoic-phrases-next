// Importar PrismaClient con ES modules
import { PrismaClient } from '../../src/generated/prisma/index.js';

// Crear instancia con configuración manual
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:123456@localhost:5432/phrases_db',
    },
  },
});

async function testPrisma() {
  try {
    console.log('Conectando a la base de datos con Prisma...');
    const result = await prisma.$queryRaw`SELECT NOW() as now`;
    console.log('Conexión exitosa con Prisma');
    console.log('Hora del servidor:', result[0].now);
    return true;
  } catch (error) {
    console.error('Error con Prisma:', error);
    return false;
  } finally {
    await prisma.$disconnect();
    console.log('Desconectado de Prisma');
  }
}

testPrisma();
