/**
 * Script para configurar la base de datos de pruebas usando Prisma
 * Este script reemplaza la configuración manual con pg
 */

import { seedTestDatabase } from '../../scripts/seed-test-db.ts';

console.log('🔧 Setting up test database with Prisma...');
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

async function setupTestDb() {
  try {
    // El seeding ya maneja la limpieza y creación de datos
    await seedTestDatabase();
    console.log('✅ Test database setup completed successfully');
  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    process.exit(1);
  }
}

// Ejecutar setup
setupTestDb();
