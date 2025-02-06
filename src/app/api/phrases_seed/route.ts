import { pool } from "../../../../db";
import phrases from "./phrases.json";

interface Phrase {
  author: string;
  phrase: string;
}
async function populateDatabase(): Promise<void> {
  try {
    console.log(
      "Inicializando el proceso de creación de tabla y población de datos..."
    );

    // Create or recreate the 'phrases' table
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

    // Populate the 'phrases' table
    const insertPromises = (phrases as Phrase[]).map(({ author, phrase }) =>
      pool.query(`INSERT INTO phrases (author, phrase) VALUES ($1, $2)`, [
        author,
        phrase,
      ])
    );
    await Promise.all(insertPromises);
    console.log('Datos insertados exitosamente en la tabla "phrases".');
    // Retrieve the data from the 'phrases' table
    const result = await pool.query("SELECT * FROM phrases");
    console.log('Datos actuales en la tabla "phrases":');
    console.table(result.rows); // Mostrar datos en forma de tabla

    console.log("Script ejecutado exitosamente.");
    process.exit(0); // Finalizar el proceso correctamente
  } catch (error: unknown) {
    console.error(
      "Error durante la ejecución del script:",
      (error as Error).message
    );
    process.exit(1); // Finalizar con error
  }
}

// Ejecutar el script
populateDatabase();
