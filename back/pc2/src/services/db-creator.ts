import { Pool } from 'pg';
const { Client } = require('pg');


// Configurações para conectar diretamente ao banco postgres
const config = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Conectamos ao banco padrão para criar o novo
};

const db_name = 'songguesser';

const tables = {
    room: `
        CREATE TABLE IF NOT EXISTS ${db_name}.room (
            id SERIAL PRIMARY KEY,
            room_code VARCHAR(6) NOT NULL,
            room_password VARCHAR(100),
            room_state VARCHAR(100),
            room_language VARCHAR(50),
            max_players INT,
            max_rounds INT,
            current_round INT,
            current_players INT,
            current_word VARCHAR(100),
        );
    `,

    player: `
        CREATE TABLE IF NOT EXISTS ${db_name}.player (
            id SERIAL PRIMARY KEY,
            player_name VARCHAR(100) NOT NULL,
            player_score INT,
            player_photo INT,
            is_admin BOOLEAN,
            room_id INT,
            FOREIGN KEY (room_id) REFERENCES ${db_name}.room(id)
        );
    `,

    round: `
        CREATE TABLE IF NOT EXISTS ${db_name}.round(
            id SERIAL PRIMARY KEY,
            artist_name VARCHAR(200) NOT NULL,
            song_name VARCHAR(200) NOT NULL,
            is_correct BOOLEAN,
            round_number INT,
            selected_music_id INT,
            selected_music_api VARCHAR(250),
            player_id INT,
            room_id INT,
            FOREIGN KEY (player_id) REFERENCES ${db_name}.player(id),
            FOREIGN KEY (room_id) REFERENCES ${db_name}.room(id) 
        );
    `,

    word: `
        CREATE TABLE IF NOT EXISTS ${db_name}.word(
            id SERIAL PRIMARY KEY,
            word VARCHAR(200) NOT NULL,
            language VARCHAR(50) NOT NULL,
        );
    `,
}

async function deleteDatabase(){
    const client = new Client(config);
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${db_name};`);
    await client.end();
}

async function deleteTables(){
    const client = new Client(config);
    await client.connect();
    await client.query(`DROP TABLE IF EXISTS ${db_name}.round;`);
    await client.query(`DROP TABLE IF EXISTS ${db_name}.player;`);
    await client.query(`DROP TABLE IF EXISTS ${db_name}.room;`);
    await client.query(`DROP TABLE IF EXISTS ${db_name}.word;`);
    await client.end();
}

async function deleteTable(table_name: string){
    const client = new Client(config);
    await client.connect();
    await client.query(`DROP TABLE IF EXISTS ${db_name}.${table_name};`);
    await client.end();
}

async function createDatabase(){
    const client = new Client(config);
    await client.connect();
    await client.query(`CREATE DATABASE ${db_name};`);
    await client.end();
}

async function createTables(){
    config['database'] = db_name;
    const client = new Client(config);
    await client.connect();
    for (const table of Object.values(tables)){
        await client.query(table);
    }
    await client.end();
}


async function createTable(table_name: string){
    const client = new Client(config);
    await client.connect();
    await client.query(tables[table_name]);
    await client.end();
}