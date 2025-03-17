import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: isProduction ? false : false, // Cambia esto a false si el servidor no admite SSL
  // ssl: isProduction ? { rejectUnauthorized: false } : false, // Habilitar SSL en producción
};

export const pool = new Pool(dbConfig);
