import { pool } from './db.js';

async function testConnection() {
  try {
    console.log('Probando conexión a la base de datos...');
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa. Hora del servidor:', result.rows[0].now);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 