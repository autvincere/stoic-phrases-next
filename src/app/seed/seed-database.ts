/*
 * * Mandatory
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';
import prisma from '../../lib/prisma';

// Determinar el entorno y cargar variables antes de cualquier importación de Prisma
const env = process.env.NODE_ENV || 'development';
console.log('Entorno actual:', env);

// Determinar qué archivo .env cargar según el entorno
let envFile = '.env.local';
if (env === 'production') {
  envFile = '.env.production';
} else if (env === 'test') {
  envFile = '.env.test';
}

// Ruta absoluta al archivo .env
const envPath = path.resolve(process.cwd(), envFile);
console.log('Cargando variables de entorno desde:', envPath);
dotenv.config({ path: envPath });

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'No definida');

// Get the directory name in ESM (required since __dirname isn't available in ESM)
const currentDir = dirname(fileURLToPath(import.meta.url));

// Import cloudinary config
import cloudinary from '../../../cloudinaryConfig.ts';
import phrasesData from './phrases.json' assert { type: 'json' };

interface Phrase {
  author: string;
  phrase: string;
  imagePath: string;
}

interface ICloudinaryImageResource {
  public_id: string;
  secure_url: string;
  // Add other properties as needed
}

/**
 * Función para buscar una imagen en Cloudinary
 * @param {string}
 * @returns {ICloudinaryImageResource | null}
 */
export async function findImageInCloudinary(
  fileName: string,
): Promise<ICloudinaryImageResource | null> {
  try {
    const result = await cloudinary.search
      .expression(`public_id:phrases_images/${fileName}`) // Buscar por public_id (hash)
      .execute();

    if (result.resources.length > 0) {
      console.log('Imagen encontrada en Cloudinary:', result.resources[0]);
      return result.resources[0]; // Retorna la primera imagen encontrada
    } else {
      console.log('No se encontró la imagen en Cloudinary.');
    }

    return null;
  } catch (error) {
    console.error('Error buscando la imagen en Cloudinary:', error);
    return null;
  }
}

/**
 * Función para subir una imagen a Cloudinary
 * @param {string} imagePath - La ruta de la imagen a subir
 * @returns {Promise<string | null>} - La URL de la imagen desplegada o null si hay error
 */
export async function uploadImageToCloudinary(imagePath: string): Promise<string | null> {
  try {
    // 1. Calcular el hash de la imagen
    const imageRoute: string = String(currentDir + imagePath);
    console.log('imageRoute:', imageRoute);
    const filename = path.basename(imageRoute, path.extname(imageRoute));
    console.log('filename:', filename);

    // 2. Buscar si ya existe una imagen con este hash en Cloudinary
    const existingImage = await findImageInCloudinary(filename);

    if (existingImage) {
      console.log('Imagen ya existe en Cloudinary:', existingImage.secure_url);
      return existingImage.secure_url; // Retorna la URL de la imagen existente
    }

    // 3. Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(imageRoute, {
      folder: 'phrases_images',
      public_id: filename,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    return null;
  }
}

// async function uploadImageToProvider(imageRoute: string): Promise<void> {
//   console.log("__dirname:", __dirname);
//   const imagePath: string = String(__dirname + "/" + imageRoute);
//   console.log("Subiendo la imagen a Cloudinary:", imagePath);
//   try {
//     const imageUrl = await uploadImageToCloudinary(imagePath);
//     console.log("Image uploaded successfully:", imageUrl);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error uploading image:", error.message);
//     } else {
//       console.error("Error uploading image:", error);
//     }
//   }
// }

// uploadImageToProvider(phrases[4].imagePath);

/**
 * Función para poblar la base de datos con frases e imágenes
 * Limpia la tabla existente y la repuebla con datos desde phrasesData
 * Sube las imágenes a Cloudinary y almacena las URLs en la base de datos
 * @returns {Promise<void>} - No retorna valor, pero puede lanzar errores
 * @throws {Error} - Si hay problemas con la base de datos o subida de imágenes
 */
export const populateDatabase = async (): Promise<void> => {
  try {
    console.log('Entorno actual:', process.env.NODE_ENV);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Inicializando el proceso de creación de tabla y población de datos...');

    // Limpiar la tabla existente - usando Prisma
    await prisma.phrases.deleteMany({});
    console.log('Tabla "Phrases" limpiada.');

    // Poblar la tabla 'Phrases' con los datos usando Prisma
    for (const { author, phrase, imagePath } of phrasesData as Phrase[]) {
      const imageUrl: string | null = await uploadImageToCloudinary(imagePath);
      if (!imageUrl) {
        console.warn(`Saltando la frase debido a un error al subir la imagen: ${imagePath}`);
        continue; // Continúa con la siguiente frase si no hay URL
      }

      await prisma.phrases.create({
        data: {
          id: crypto.randomUUID(),
          author,
          phrase,
          image_url: imageUrl,
          updated_at: new Date(),
        },
      });
    }
    console.log('Datos insertados exitosamente en la tabla "Phrases".');

    // Recuperar los datos insertados para confirmar
    const phrasesFromDb = await prisma.phrases.findMany();
    console.log('Datos actuales en la tabla "Phrases":');
    console.table(phrasesFromDb);

    console.log('Script ejecutado exitosamente.');
  } catch (error) {
    console.error(
      'Error durante la ejecución del script:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  } finally {
    // Desconectar Prisma antes de salir
    await prisma.$disconnect();
    process.exit(0);
  }
};

/**
 * Exporta las funciones y variables necesarias para las pruebas.
 * Este objeto no se usa en la ejecución normal, solo para pruebas.
 */
export const seedUtils = {
  findImageInCloudinary,
  uploadImageToCloudinary,
  populateDatabase,
  // Para pruebas avanzadas
  phrases: phrasesData,
};

console.log('process.argv[1]:', process.argv[1]);
console.log('import.meta.url:', import.meta.url);
console.log('Condition result:', process.argv[1] && import.meta.url.includes(process.argv[1]));
if (process.argv[1] && import.meta.url.includes(process.argv[1])) {
  populateDatabase();
}
