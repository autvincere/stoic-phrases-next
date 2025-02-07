import { Pool } from 'pg';

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones a NeonDB
  },
};

export const pool = new Pool(dbConfig);
