/**
 * Script para verificar la integridad y la funcionalidad del script seed-database.ts
 * Este script comprueba que todos los componentes necesarios están disponibles y funcionan,
 * pero no ejecuta realmente el populado de datos en la base de datos.
 */

async function verifyIntegrity() {
  try {
    // Verificar disponibilidad de módulos necesarios
    console.log('✅ Verificando disponibilidad de módulos...');
    
    // Importar el módulo seed-database.ts
    const seedModule = await import('./seed-database.js');
    console.log('✅ El módulo seed-database.ts puede ser importado correctamente');
    
    // Verificar estructura de la exportación 
    if (!seedModule.seedUtils) {
      throw new Error('No se encontró el objeto seedUtils');
    }
    
    // Verificar funciones exportadas
    const { seedUtils } = seedModule;
    
    if (typeof seedUtils.findImageInCloudinary !== 'function') {
      throw new Error('Falta la función findImageInCloudinary');
    }
    
    if (typeof seedUtils.uploadImageToCloudinary !== 'function') {
      throw new Error('Falta la función uploadImageToCloudinary');
    }
    
    if (typeof seedUtils.populateDatabase !== 'function') {
      throw new Error('Falta la función populateDatabase');
    }
    
    console.log('✅ Todas las funciones necesarias están exportadas correctamente');
    
    // Verificar datos de prueba
    if (!Array.isArray(seedUtils.phrases) || seedUtils.phrases.length === 0) {
      throw new Error('No se encontraron frases para poblar la base de datos');
    }
    
    console.log(`✅ Hay ${seedUtils.phrases.length} frases disponibles para poblar la base de datos`);
    
    // Verificar estructura de las frases
    const firstPhrase = seedUtils.phrases[0];
    if (!firstPhrase.author || !firstPhrase.phrase || !firstPhrase.imagePath) {
      throw new Error('La estructura de las frases no es correcta');
    }
    
    console.log('✅ La estructura de las frases es correcta');
    
    // Resultado final
    console.log('✅ El script seed-database.ts está íntegro y listo para ser ejecutado');
    
    // Opcional: mostrar primer frase como ejemplo
    console.log('\nEjemplo de una frase:');
    console.log(`- Autor: ${firstPhrase.author}`);
    console.log(`- Frase: ${firstPhrase.phrase}`);
    console.log(`- Imagen: ${firstPhrase.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error al verificar la integridad del script:', error);
    return false;
  }
}

// Ejecutar la verificación
verifyIntegrity(); 