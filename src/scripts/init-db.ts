import { prisma } from '../lib/db';

/**
 * Script para inicializar la base de datos y verificar la conexión
 */
async function main() {
  try {
    // Verificar la conexión a la base de datos
    const result = await prisma.$queryRaw<[{ time: Date }]>`SELECT NOW() as time`;
    console.log('✅ Conexión exitosa a la base de datos');
    console.log('Hora del servidor:', result[0].time);

    // Contar los registros en la tabla Phrases
    const count = await prisma.phrases.count();
    console.log(`La tabla Phrases tiene ${count} registros`);

    // Ejemplo de consulta
    if (count > 0) {
      const sample = await prisma.phrases.findFirst();
      console.log('Muestra de un registro:');
      console.log(sample);
    }
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar la conexión a Prisma
    await prisma.$disconnect();
  }
}

main();
