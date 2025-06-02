// Script para probar que Prisma funciona correctamente
import { PrismaClient } from '../../src/generated/prisma';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Cargar variables de entorno
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'development' ? '.env.local' : '.env.production';
dotenv.config({ path: path.join(rootDir, envFile) });

console.log(`[Prisma] Usando variables de entorno de: ${envFile}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Definida' : 'No definida'}`);

async function testPrisma() {
  const prisma = new PrismaClient();

  try {
    console.log('Conectando con Prisma...');
    await prisma.$connect();
    console.log('Conexión exitosa');

    console.log('Consultando la base de datos...');
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Consulta exitosa:', result);
  } catch (error) {
    console.error('Error de Prisma:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Desconectado de Prisma');
  }
}

testPrisma();
