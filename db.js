import pkg from 'pg';
const { Pool } = pkg;
// console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
// console.log("🔍 Configuración de la base de datos:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

let dbConfig;

if (isProduction) {
 dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false }, // Habilitar SSL en producción
 };
} else if (isTest){
  dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'phrases_db',
    password: '123456',
    port: 5432,
    ssl: false,
  };
} else {
  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

    ssl: false,
  };
}
// console.log("🔍 Conectando a la base de datos con la siguiente configuración:");
// console.log(dbConfig);

export const pool = new Pool(dbConfig);
