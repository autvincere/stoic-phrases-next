import { Pool } from 'pg';
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 Configuración de la base de datos:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  //ssl: isProduction ? false : false, // Cambia esto a false si el servidor no admite SSL
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Habilitar SSL en producción
};
console.log("🔍 Conectando a la base de datos con la siguiente configuración:");
console.log(dbConfig);

export const pool = new Pool(dbConfig);
