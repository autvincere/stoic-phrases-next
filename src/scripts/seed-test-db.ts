import prisma from '../lib/prisma';
import crypto from 'crypto';

const testPhrases = [
  {
    author: 'Marco Aurelio',
    phrase: 'La vida de un hombre es lo que sus pensamientos hacen de ella.',
    image_url: 'https://example.com/image1.jpg',
  },
  {
    author: 'Séneca',
    phrase:
      'No nos atrevemos a muchas cosas porque son difíciles, pero son difíciles porque no nos atrevemos a hacerlas.',
    image_url: 'https://example.com/image2.jpg',
  },
  {
    author: 'Epicteto',
    phrase:
      'No busques que los acontecimientos sucedan como tú quieres, sino deséalos tal y como suceden, y vivirás en armonía.',
    image_url: 'https://example.com/image3.jpg',
  },
  {
    author: 'Marco Aurelio',
    phrase:
      'Muy poco se necesita para hacer una vida feliz; todo está dentro de ti mismo, en tu forma de pensar.',
    image_url: 'https://example.com/image4.jpg',
  },
  {
    author: 'Séneca',
    phrase: 'La riqueza consiste mucho más en el disfrute que en la posesión.',
    image_url: 'https://example.com/image5.jpg',
  },
];

async function seedTestDatabase() {
  try {
    console.log('🌱 Seeding test database...');

    // Limpiar datos existentes
    await prisma.phrases.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insertar datos de prueba
    for (const phraseData of testPhrases) {
      await prisma.phrases.create({
        data: {
          id: crypto.randomUUID(),
          author: phraseData.author,
          phrase: phraseData.phrase,
          image_url: phraseData.image_url,
          updated_at: new Date(),
        },
      });
    }

    console.log(`✅ Inserted ${testPhrases.length} test phrases`);

    // Verificar datos insertados
    const count = await prisma.phrases.count();
    console.log(`✅ Total phrases in database: ${count}`);

    console.log('🎉 Test database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding test database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si el script se llama directamente
if (import.meta.url.includes(process.argv[1] || '')) {
  seedTestDatabase();
}

export { seedTestDatabase, testPhrases };
