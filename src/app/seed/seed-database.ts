/*
* * Mandatory
*/
import dotenv from 'dotenv';
dotenv.config(); // Cargar variables de entorno

// import { connectDatabaseTest } from '../utils';

import { pool } from '../../../db.ts';
import phrases from "./phrases.json";

// connectDatabaseTest(pool);
interface Phrase {
     author: string;
     phrase: string;
}

async function populateDatabase(): Promise<void> {
     try {
         console.log('Inicializando el proceso de creación de tabla y población de datos...');
 
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
                     phrase VARCHAR(255) NOT NULL
                 );
             END $$;
         `);
         console.log('Tabla "phrases" creada o recreada.');
 
         // Poblar la tabla 'phrases' con los datos
         const insertPromises = (phrases as Phrase[]).map(async ({ author, phrase }) => {
             // Subir imagen a Cloudinary (si fuera necesario)
             // const uploadedImage = await cloudinary.uploader.upload(pathToImage, { folder: 'my-folder' });
 
             // Guardar datos en la base de datos
             return pool.query(
                 `INSERT INTO phrases (author, phrase) VALUES ($1, $2)`,
                 [author, phrase]
             );
         });
 
         await Promise.all(insertPromises);
         console.log('Datos insertados exitosamente en la tabla "phrases".');
 
         // Recuperar los datos insertados para confirmar
         const result = await pool.query('SELECT * FROM phrases');
         console.log('Datos actuales en la tabla "phrases":');
         console.table(result.rows);
 
         console.log('Script ejecutado exitosamente.');

     } catch (error) {
         console.error('Error durante la ejecución del script:', error instanceof Error ? error.message : error);
         process.exit(1);
         
     } finally {
        // Cierra el pool antes de salir
        await pool.end();
        process.exit(0);
    }
}

populateDatabase();