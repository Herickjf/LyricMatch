// // import { Pool } from 'pg';
// import { query } from './db-query';
// import { table } from 'console';
// const { Client } = require('pg');



// // Configurações para conectar diretamente ao banco postgres
// const config = {
//     user: 'postgres',
//     password: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     database: 'postgres', // Conectamos ao banco padrão para criar o novo
// };

// const db_name = 'songguesser';

// const tables = {
//     room: `
//         CREATE TABLE IF NOT EXISTS ${db_name}.room (
//             id SERIAL PRIMARY KEY,
//             room_code VARCHAR(6) NOT NULL,
//             room_password VARCHAR(100),
//             room_state VARCHAR(100),
//             room_language VARCHAR(50),
//             max_players INT,
//             max_rounds INT,
//             current_round INT,
//             current_players INT,
//             current_word VARCHAR(100),
//         );
//     `,

//     player: `
//         CREATE TABLE IF NOT EXISTS ${db_name}.player (
//             id SERIAL PRIMARY KEY,
//             player_name VARCHAR(100) NOT NULL,
//             player_score INT,
//             player_photo INT,
//             is_admin BOOLEAN,
//             room_id INT,
//             FOREIGN KEY (room_id) REFERENCES ${db_name}.room(id)
//         );
//     `,

//     guess: `
//         CREATE TABLE IF NOT EXISTS ${db_name}.guess(
//             id SERIAL PRIMARY KEY,
//             artist_name VARCHAR(200) NOT NULL,
//             song_name VARCHAR(200) NOT NULL,
//             is_correct BOOLEAN,
//             selected_music_id INT,
//             selected_music_api VARCHAR(250),
//             player_id INT,
//             room_id INT,
//             FOREIGN KEY (player_id) REFERENCES ${db_name}.player(id),
//             FOREIGN KEY (room_id) REFERENCES ${db_name}.room(id) 
//         );
//     `,

//     word: `
//         CREATE TABLE IF NOT EXISTS ${db_name}.word(
//             id SERIAL PRIMARY KEY,
//             word VARCHAR(200) NOT NULL,
//             language VARCHAR(50) NOT NULL,
//         );
//     `,

//     word_sorted: `
//         CREATE TABLE IF NOT EXISTS ${db_name}.word_sorted(
//             id SERIAL PRIMARY KEY,
//             word VARCHAR(200) NOT NULL,
//             room_id INT,
//             FOREIGN KEY (room_id) REFERENCES ${db_name}.room(id)
//         );
//     `,
// }

// /**
//  * Deletes the database "songguesser"
// */
// async function deleteDatabase(){
//     await query(`DROP DATABASE IF EXISTS ${db_name};`);
// }

// /**
//  * Deletes all tables in the database "songguesser"
// */
// async function deleteTables(){
//     for (const table of Object.keys(tables)){
//         await query(`DROP TABLE
//             IF EXISTS ${db_name}.${table};`);
//     }
// }

// /**
//  * Deletes a specific table in the database "songguesser"
//  * @param table_name the name of the table to be deleted
// */
// async function deleteTable(table_name: string){
//     await query(`DROP TABLE IF EXISTS ${db_name}.${table_name};`);
// }

// /**
//  * Creates the database "songguesser"
// */
// async function createDatabase(){
//     const client = new Client(config);
//     await client.connect();
//     await client.query(`CREATE DATABASE ${db_name};`);
//     await client.end();
// }

// /**
//  * Creates all tables in the database "songguesser"
// */
// async function createTables(){
//     for(const table of Object.keys(tables)){
//         await query(tables[table]);
//     }
// }

// /**
//  * Creates a specific table in the database "songguesser"
//  * @param table_name the name of the table to be created
// */
// async function createTable(table_name: string){
//     await query(tables[table_name]);
// }

// // Export the functions that create the data structures in the database
// export { createDatabase, createTables, deleteDatabase, deleteTables, createTable, deleteTable };