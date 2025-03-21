const { Pool }   = require('pg');
const { Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'songguesser',
    port: 5432,
});


/**
 * 
 * @param text the query to be executed
 * @param params the parameters of the query
 * @returns the result of the query
 */
async function query(text:string, params: any = null) {
    const client = await pool.connect();
    try {
      if (params == null) {
        const result = await client.query(text);
        return result.rows;
      }else{
        const result = await client.query(text, params);
        return result.rows;
      }
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    } finally {
      client.release();
    }
}



export { query };