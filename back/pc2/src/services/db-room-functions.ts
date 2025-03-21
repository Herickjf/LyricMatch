// Pega a função de query do arquivo db-query.ts
import { query } from './db-query';

/*
    THIS FILE CONTAINS TO MANIPULATE THE ROOM TABLE
*/

interface Room{
    room_code?: string;
    room_password: string;
    room_state: string;
    room_language: string;
    max_players: number;
    max_rounds: number;
    current_round?: number;
    current_players?: number;
    current_word?: string;
}

/**
 * Inserts a room in the database
 * @param room 
 * @returns returns the complete json of the inserted room
*/
async function insertRoom(room: Room) : Promise<JSON>{
    const sql = `
        INSERT INTO room (room_code, room_password, room_state, room_language, max_players, max_rounds)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const result = await query(sql, 
        [
            room.room_code ?? await generateRoomCode(),
            room.room_password,
            room.room_state,
            room.room_language,
            room.max_players,
            room.max_rounds,
            room.current_players ?? 0,
            room.current_round ?? 0,
            room.current_word ?? '',     
        ]);
    return result[0];
}

/**
 * Deletes a room from the database
 * @param room_code Id (if number) or Code (if string) of the room to be deleted
 * @returns the complete json of the deleted room
*/
async function deleteRoom(room: string|number) : Promise<JSON>{
    if(typeof room == 'number'){
        const result = await query('DELETE FROM room WHERE id = $1 RETURNING *', [room]);
        return result[0];
    } else {
        const result = await query('DELETE FROM room WHERE room_code = $1 RETURNING *', [room]);
        return result[0];
    }
}

/**
 * Gets a room from the database
 * @param room_code Id (if number) or Code (if string) of the room to be retrieved
 * @returns the complete json of the room
*/
async function getRoom(room: string|number) : Promise<JSON>{
    if(typeof room == 'number'){
        const result = await query('SELECT * FROM room WHERE id = $1', [room]);
        return result[0];
    } else {
        const result = await query('SELECT * FROM room WHERE room_code = $1', [room]);
        return result[0];
    }
}

/**
    * @param room_code Id (if number) or Code (if string) of the room to be checked
    * @returns if the room exists
*/
async function roomExists(room: string|number) : Promise<boolean>{
    if(typeof room == 'number'){
        const result = await query('SELECT * FROM room WHERE id = $1', [room]);
        return result.length > 0;
    } else {
        const result = await query('SELECT * FROM room WHERE room_code = $1', [room]);
        return result.length > 0;
    }
}

/**
    * Generates a random room codem that is not in the database
    * @returns a random room code
*/
async function generateRoomCode() : Promise<string>{
    let code: string;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    do {
        code = '';
        for (let i = 0; i < 6; i++){
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    } while (await roomExists(code));
    return code;
}

/**
    * @param room_code Id (if number) or Code (if string) of the room to be checked
    * @returns the state of the room
*/
async function setRoomState(room: string|number, state: string) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET room_state = $1 WHERE id = $2', [state, room]);
    } else {
        await query('UPDATE room SET room_state = $1 WHERE room_code = $2', [state, room]);
    }
}

/**
    * @param room_code Id (if number) or Code (if string) of the room to be checked
    * @returns the state of the room
*/
async function getRoomState(room: string|number) : Promise<string>{
    if(typeof room == 'number'){
        const result = await query('SELECT room_state FROM room WHERE id = $1', [room]);
        return result[0].room_state;
    } else {
        const result = await query('SELECT room_state FROM room WHERE room_code = $1', [room]);
        return result[0].room_state;
    }
}

/**
    * Get the player that is the admin of the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the player that is the admin of the room
*/
async function getAdmin(room: string|number) : Promise<JSON>{
    if(typeof room == 'number'){
        const result = await query('SELECT * FROM player WHERE room_id = $1 AND is_admin = true', [room]);
        return result[0];
    } else {
        const result = await query('SELECT * FROM player WHERE room_id = (SELECT id FROM room WHERE room_code = $1) AND is_admin = true', [room]);
        return result[0];
    }
}

/**
    * Get the quantity of players in the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the quantity of players in the room
*/
async function getPlayersQuantity(room: string|number) : Promise<number>{
    if(typeof room == 'number'){
        const result = await query('SELECT current_players FROM room WHERE id = $1', [room]);
        return result[0].current_players;
    } else {
        const result = await query('SELECT current_players FROM room WHERE room_code = $1', [room]);
        return result[0].current_players;
    }
}

/**
    * Get the maximum quantity of players in the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the maximum quantity of players in the room
*/
async function getMaxPlayers(room: string|number) : Promise<number>{
    if(typeof room == 'number'){
        const result = await query('SELECT max_players FROM room WHERE id = $1', [room]);
        return result[0].max_players;
    } else {
        const result = await query('SELECT max_players FROM room WHERE room_code = $1', [room]);
        return result[0].max_players;
    }
}

/**
    * Get the current round of the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the current round of the room
*/
async function getCurrentRound(room: string|number) : Promise<number>{
    if(typeof room == 'number'){
        const result = await query('SELECT current_round FROM room WHERE id = $1', [room]);
        return result[0].current_round;
    } else {
        const result = await query('SELECT current_round FROM room WHERE room_code = $1', [room]);
        return result[0].current_round;
    }
}

/**
    * Get the maximum quantity of rounds in the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the maximum quantity of rounds in the room
*/
async function getMaxRounds(room: string|number) : Promise<number>{
    if(typeof room == 'number'){
        const result = await query('SELECT max_rounds FROM room WHERE id = $1', [room]);
        return result[0].max_rounds;
    } else {
        const result = await query('SELECT max_rounds FROM room WHERE room_code = $1', [room]);
        return result[0].max_rounds;
    }
}

/**
    * Get the current word of the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the current word of the room
*/
async function getCurrentWord(room: string|number) : Promise<string>{
    if(typeof room == 'number'){
        const result = await query('SELECT current_word FROM room WHERE id = $1', [room]);
        return result[0].current_word;
    } else {
        const result = await query('SELECT current_word FROM room WHERE room_code = $1', [room]);
        return result[0].current_word;
    }
}

/**
    * Get the language of the room
    * @param room Id (if number) or Code (if string) of the room to be checked
    * @returns the language of the room
*/
async function getLanguage(room: string|number) : Promise<string>{
    if(typeof room == 'number'){
        const result = await query('SELECT room_language FROM room WHERE id = $1', [room]);
        return result[0].room_language;
    } else {
        const result = await query('SELECT room_language FROM room WHERE room_code = $1', [room]);
        return result[0].room_language;
    }
}

/**
    * Check if there is a room with the code and password given
    * @param room_code Id (if number) or Code (if string) of the room to be checked
    * @param room_password password of the room
    * @returns if the room exists, returns the room
*/
async function checkRoomPassword(room_code: string, room_password: string) : Promise<JSON>{
    const result = await query('SELECT * FROM room WHERE room_code = $1 AND room_password = $2', [room_code, room_password]);
    return result[0];
}

/**
    * Increments the quantity of players in the room
    * @param room_code Id (if number) or Code (if string) of the room to be checked
*/
async function incrementPlayers(room: string|number) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET current_players = current_players + 1 WHERE id = $1', [room]);
    } else {
        await query('UPDATE room SET current_players = current_players + 1 WHERE room_code = $1', [room]);
    }
}

/**
    * Decrements the quantity of players in the room
    * @param room_code Id (if number) or Code (if string) of the room to be checked
*/
async function decrementPlayers(room: string|number) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET current_players = current_players - 1 WHERE id = $1', [room]);
    } else {
        await query('UPDATE room SET current_players = current_players - 1 WHERE room_code = $1', [room]);
    }
}

/**
    * Increments the current round of the room
    * @param room_code Id (if number) or Code (if string) of the room to be checked
*/
async function incrementRound(room: string|number) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET current_round = current_round + 1 WHERE id = $1', [room]);
    } else {
        await query('UPDATE room SET current_round = current_round + 1 WHERE room_code = $1', [room]);
    }
}

/**
    * Resets the current round of the room
    * @param room_code Id (if number) or Code (if string) of the room to be checked
*/
async function resetRounds(room: string|number) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET current_round = 0 WHERE id = $1', [room]);
    } else {
        await query('UPDATE room SET current_round = 0 WHERE room_code = $1', [room]);
    }
}

/**
    * Sets the current word of the room
    * @param room_code Id (if number) or Code (if string) of the room to be checked
    * @param word to be set
*/
async function setCurrentWord(room: string|number, word: string) : Promise<void>{
    if(typeof room == 'number'){
        await query('UPDATE room SET current_word = $1 WHERE id = $2', [word, room]);
    } else {
        await query('UPDATE room SET current_word = $1 WHERE room_code = $2', [word, room]);
    }
}

export {
    insertRoom,
    deleteRoom,
    getRoom,
    roomExists,
    generateRoomCode,
    setRoomState,
    getRoomState,
    getAdmin,
    getPlayersQuantity,
    getMaxPlayers,
    getCurrentRound,
    getMaxRounds,
    getCurrentWord,
    getLanguage,
    checkRoomPassword,
    incrementPlayers,
    decrementPlayers,
    incrementRound,
    resetRounds,
    setCurrentWord
}