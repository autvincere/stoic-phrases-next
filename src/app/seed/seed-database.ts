/*
 * * Mandatory
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name in ESM (required since __dirname isn't available in ESM)
const currentDir = dirname(fileURLToPath(import.meta.url));

// Carga las variables de entorno según el entorno
const env = process.env.NODE_ENV || 'development';
console.log("Entorno actual:", env);

// Ruta absoluta al archivo .env
const envPath = path.resolve(
  process.cwd(), 
  env === 'development' ? '.env.local' : '.env.production'
);
console.log("Cargando variables de entorno desde:", envPath);
dotenv.config({ path: envPath });

// Import from the project root using relative paths from the current file
import { pool } from "../../../db.js";
import cloudinary from "../../../cloudinaryConfig.ts";
import phrases from "./phrases.json" assert { type: "json" };
// import { connectDatabaseTest } from "../utils/database.js";

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
  fileName: string
): Promise<ICloudinaryImageResource | null> {
  try {
    const result = await cloudinary.search
      .expression(`public_id:phrases_images/${fileName}`) // Buscar por public_id (hash)
      .execute();

    if (result.resources.length > 0) {
      console.log("Imagen encontrada en Cloudinary:", result.resources[0]);
      return result.resources[0]; // Retorna la primera imagen encontrada
    } else {
      console.log("No se encontró la imagen en Cloudinary.");
    }

    return null;
  } catch (error) {
    console.error("Error buscando la imagen en Cloudinary:", error);
    return null;
  }
}
// Funcion con 3 tipos de return
// 1. string: URL de la imagen existente
// 2. null: Error al subir la imagen
// 3. ICloudinaryImageResource: URL de la imagen nueva

export async function uploadImageToCloudinary(
  imagePath: string
): Promise<string | null> {
  try {
    // 1. Calcular el hash de la imagen
    const imageRoute: string = String(currentDir + imagePath);
    console.log("imageRoute:", imageRoute);
    const filename = path.basename(imageRoute, path.extname(imageRoute));
    console.log("filename:", filename);

    // 2. Buscar si ya existe una imagen con este hash en Cloudinary
    const existingImage = await findImageInCloudinary(filename);

    if (existingImage) {
      console.log("Imagen ya existe en Cloudinary:", existingImage.secure_url);
      return existingImage.secure_url; // Retorna la URL de la imagen existente
    }

    const result = await cloudinary.uploader.upload(imageRoute, {
      folder: "phrases_images",
      public_id: filename,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
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

export async function populateDatabase(): Promise<void> {
  try {
    console.log("Entorno actual:", process.env.NODE_ENV);
    console.log("DB_USER:",process.env.DB_USER);
    console.log({
      DB_USER: process.env.DB_USER,
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_PORT: process.env.DB_PORT,
    });
    console.log(
      "Inicializando el proceso de creación de tabla y población de datos..."
    );
    // Crear o recrear la tabla 'phrases'
    await pool.query(`
             DO $$
             BEGIN
                 IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'phrases') THEN
                     DROP TABLE phrases;
                 END IF;
                 CREATE TABLE phrases (
                     id SERIAL PRIMARY KEY,
                     author VARCHAR(255) NOT NULL,
                     phrase VARCHAR(255) NOT NULL,
                     image_url VARCHAR(255)
                 );
             END $$;
         `);
    console.log('Tabla "phrases" creada o recreada.');

    // Poblar la tabla 'phrases' con los datos
    for (const { author, phrase, imagePath } of phrases as Phrase[]) {
      const imageUrl = await uploadImageToCloudinary(imagePath);
      if (!imageUrl) {
        console.warn(
          `Saltando la frase debido a un error al subir la imagen: ${imagePath}`
        );
        continue; // Continúa con la siguiente frase si no hay URL
      }

      await pool.query(
        `INSERT INTO phrases (author, phrase, image_url) VALUES ($1, $2, $3)`,
        [author, phrase, imageUrl]
      );
    }
    console.log('Datos insertados exitosamente en la tabla "phrases".');

    // Recuperar los datos insertados para confirmar
    const result = await pool.query("SELECT * FROM phrases");
    console.log('Datos actuales en la tabla "phrases":');
    console.table(result.rows);

    console.log("Script ejecutado exitosamente.");
  } catch (error) {
    console.error(
      "Error durante la ejecución del script:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  } finally {
    // Cierra el pool antes de salir
    await pool.end();
    process.exit(0);
  }
}

/**
 * Exporta las funciones y variables necesarias para las pruebas.
 * Este objeto no se usa en la ejecución normal, solo para pruebas.
 */
export const seedUtils = {
  findImageInCloudinary,
  uploadImageToCloudinary,
  populateDatabase,
  // Para pruebas avanzadas
  phrases
};

console.log('process.argv[1]:', process.argv[1]);
console.log('import.meta.url:', import.meta.url);
console.log('Condition result:', process.argv[1] && import.meta.url.includes(process.argv[1]));
if (process.argv[1] && import.meta.url.includes(process.argv[1])) {
  populateDatabase();
}

// Use a self-invoking async function to handle the promise rejection properly
// (async () => {
//   try {
//     await connectDatabaseTest(pool);
//     // Uncomment when ready to populate the database
//     // await populateDatabase();
//   } catch (error) {
//     console.error("Error:", error);
//     process.exit(1);
//   }
// })();
