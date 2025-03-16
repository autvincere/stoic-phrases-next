/*
 * * Mandatory
 */
import dotenv from "dotenv";
console.log("Entorno actual:", process.env.NODE_ENV);
dotenv.config({
  path:
    process.env.NODE_ENV === "development"
      ? "./.env.local"
      : "./.env.production",
});
import path from "path";

// import { connectDatabaseTest } from "../utils";

import { pool } from "../../../db";
import cloudinary from "../../../cloudinaryConfig";
import phrases from "./phrases.json";

interface Phrase {
  author: string;
  phrase: string;
  imagePath: string;
}

interface CloudinaryImageResource {
  public_id: string;
  secure_url: string;
  // Add other properties as needed
}

// Función para buscar una imagen en Cloudinary
async function findImageInCloudinary(
  fileName: string
): Promise<CloudinaryImageResource | null> {
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

async function uploadImageToCloudinary(
  imagePath: string
): Promise<string | null> {
  try {
    // 1. Calcular el hash de la imagen
    const imageRoute: string = String(__dirname + imagePath);
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

async function populateDatabase(): Promise<void> {
  try {
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

populateDatabase()
// connectDatabaseTest(pool);
