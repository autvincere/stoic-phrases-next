// import dotenv from 'dotenv';
interface IConnectionPool {
  connect: () => Promise<IDatabaseClient>;
}

interface IDatabaseClient {
  release: () => void;
}

export async function connectDatabaseTest(
  connectionPool: IConnectionPool,
): Promise<void> {
  try {
    console.log({
      DB_USER: process.env.DB_USER,
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_PORT: process.env.DB_PORT,
    });
    const client: IDatabaseClient = await connectionPool.connect();
    console.log("Conexión a la base de datos exitosa");
    client.release(); // Libera el cliente
    process.exit(0); // Salida exitosa
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    process.exit(1); // Salida con error si no puede conectar
  }
}
