// import { Client } from 'pg';

// let client: Client | null = null;

/**
 * Create the connection with the database.
 * - If the connection is already created, it does nothing.
 * - If the connection is not created, it creates it.
 */
// async function createConnection(): Promise<void> {
//   if (client !== null) return;

//   client = new Client({
//     user: 'postgres',
//     password: 'postgres',
//     host: 'localhost',
//     database: 'songguesser',
//     port: 5432,
//   });

//   try {
//     await client.connect();
//     console.log('Conexão com o banco de dados estabelecida.');
//   } catch (error) {
//     console.error('Erro na conexão:', error);
//     client = null;
//     throw error;
//   }
// }

/**
 * Destroy the connection with the database.
 * - If the connection is already destroyed, it does nothing.
 */
// async function destroyConnection(): Promise<void> {
//   if (client === null) return;

//   try {
//     await client.end();
//     console.log('Conexão com o banco de dados encerrada.');
//     client = null;
//   } catch (error) {
//     console.error('Erro ao encerrar a conexão:', error);
//     throw error;
//   }
// }

/**
 * Executes a query on the persistent connection.
 * @param text the query to be executed
 * @param params the parameters of the query
 * @returns the result of the query
 */
// async function query(text: string, params: any[] = []) {
//   if (client === null) {
//     throw new Error('A conexão com o banco não foi criada.');
//   }

//   try {
//     const result = await client.query(text, params);
//     return result.rows;
//   } catch (error) {
//     console.error('Erro na query:', error);
//     throw error;
//   }
// }

// export { createConnection, destroyConnection, query };