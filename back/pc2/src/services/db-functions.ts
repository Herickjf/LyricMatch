const { Pool } = require('pg');
const { Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'songguesser',
    port: 5432,
});


// Função genérica para executar queries
async function query(text, params) {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    } finally {
      client.release();
    }
  }


// Função para pegar os players de uma sala
async function getPlayers(roomId) {
    const result = await query(
        'SELECT * FROM player WHERE room_id = $1 ORDER BY player_score DESC',
        [roomId]
    );
    return result;
}

// Função para pegar
async function getNewWord(language: string, already_sorted: number[] | string[] | undefined) {
    if (already_sorted == undefined){
        const result = await query(
            'SELECT word FROM word WHERE language = $1 ORDER BY RANDOM() LIMIT 1',
            [language]
        );
        return result[0];
    }
    else if (typeof already_sorted[0] == 'number'){
        let str_already_sorted = "(" + already_sorted.join(', ') + ")";
        const result = await query(
            `SELECT word FROM word WHERE language = $1 AND id NOT IN ${str_already_sorted} ORDER BY RANDOM() LIMIT 1`,
            [language]
        );
        return result[0];
    }
    else {
        let str_already_sorted = "('" + already_sorted.join("', '") + "')";
        const result = await query(
            `SELECT word FROM word WHERE language = $1 AND word NOT IN ${str_already_sorted} ORDER BY RANDOM() LIMIT 1`,
            [language]
        );
        return result[0];
    }
}

