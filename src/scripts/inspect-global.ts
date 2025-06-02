// Script para inspeccionar el objeto global
import { PrismaClient } from '../generated/prisma';

// Función para inspeccionar global
function inspectGlobal() {
  console.log('=== Inspeccionando objeto global ===');

  // Mostrar todas las propiedades de global
  console.log('Propiedades en global:');
  console.log(Object.keys(global));

  // Verificar si existe global.prisma
  console.log('\n=== Estado de global.prisma ===');
  console.log('¿Existe global.prisma?:', 'prisma' in global);

  if ('prisma' in global) {
    console.log('Tipo de global.prisma:', typeof global.prisma);
    console.log('¿Es instancia de PrismaClient?:', global.prisma instanceof PrismaClient);

    // Mostrar métodos disponibles en global.prisma
    console.log('\nMétodos disponibles en global.prisma:');
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(global.prisma)));
  }

  // Mostrar algunas propiedades interesantes de global
  console.log('\n=== Otras propiedades interesantes de global ===');
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  console.log('import.meta.url:', import.meta.url);

  // Mostrar el valor de algunas propiedades globales importantes
  console.log('\n=== Valores de propiedades globales importantes ===');
  console.log('global.process.version:', global.process.version);
  console.log('global.process.platform:', global.process.platform);
  console.log('global.process.arch:', global.process.arch);

  // Mostrar todas las propiedades de process
  console.log('\n=== Propiedades de process ===');
  console.log(Object.keys(process));
}

// Ejecutar la inspección
inspectGlobal();
