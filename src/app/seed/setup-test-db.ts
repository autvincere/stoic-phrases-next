import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
});

// Crear conexión a la base de datos de prueba
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupTestDb() {
  console.log('Configurando base de datos de prueba...');

  try {
    // Crear tabla de frases si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS phrases (
        id SERIAL PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        phrase TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `);

    // Verificar si hay datos
    const { rows } = await pool.query('SELECT COUNT(*) FROM phrases');

    // Si no hay datos, insertamos algunos para las pruebas
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO phrases (author, phrase, image_url) 
        VALUES 
          ('Marco Aurelio', 'La vida de un hombre es lo que sus pensamientos hacen de ella.', 'https://example.com/image1.jpg'),
          ('Séneca', 'No nos atrevemos a muchas cosas porque son difíciles, pero son difíciles porque no nos atrevemos a hacerlas.', 'https://example.com/image2.jpg'),
          ('Epicteto', 'No busques que los acontecimientos sucedan como tú quieres, sino deséalos tal y como suceden, y vivirás en armonía.', 'https://example.com/image3.jpg')
      `);
      console.log('Datos de prueba insertados correctamente');
    } else {
      console.log('La base de datos ya contiene datos');
    }

    console.log('Base de datos configurada correctamente');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar la configuración
setupTestDb();
