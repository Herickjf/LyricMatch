// Pega a função de query do arquivo db-query.ts
import { query } from './db-query';

/*
    THIS FILE CONTAINS TO MANIPULATE THE PLAYER TABLE.
    It contains the following functions:

    - createPlayer(player: Player)
    - deletePlayer(player_name: string, room: number | string)
    - getPlayers(room : number | string)
    - getPlayer(player_name: string, room: number | string)
    - getPlayerScore(player_name: string, room: number | string)
    - updatePlayerScore(player_name: string, room: number | string, score: number)
    - resetPlayerScore(player_name: string, room: number | string)
    - addToPlayerScore(player_name: string, room: number | string, add_to_score: number)
    - setPlayerAdmin(player_name: string, room: number | string, admin: boolean)
*/

interface Player {
    player_name: string;
    player_photo: number;
    player_score?: number;
    is_admin?: boolean;
    room_id: number;
}


/** 
    * @param player: player object with the following attributes:
    *   - player_name: name of the player
    *   - player_photo: photo of the player
    *   - player_score: score of the player             (optional)
    *   - is_admin: if the player is admin
    *   - room_id: id of the room where the player is
    * @returns the player created
*/
async function createPlayer(player: Player) : Promise<Player> {
    const result = await query(
        'INSERT INTO player (player_name, player_photo, player_score, is_admin, room_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
            player.player_name, 
            player.player_photo, 
            player.player_score ?? 0, 
            player.is_admin ?? false, 
            player.room_id
        ]
    );
    
    // Returns the complete json of the created player
    return result[0];
}

/**
    * @param player_name name of the player
    * @param room Id (if number) or Code (if string) of the room where the player is
*/
async function deletePlayer(player_name: string, room: number | string) : Promise<void> {
    if (typeof room == 'number'){
        await query(
            'DELETE FROM player WHERE player_name = $1 AND room_id = $2',
            [player_name, room]
        );
    }else{
        await query(
            'DELETE FROM player WHERE player_name = $1 AND room_id = (SELECT id FROM room WHERE room_code = $2)',
            [player_name, room]
        );
    }
}

/**
    * @param room Id (if number) or Code (if string) of the room where the player is
    * @returns all players in the room, ordered by score
*/
async function getPlayers(room : number | string) : Promise<JSON[]> {
    if(typeof room == 'number'){
        const result = await query(
            'SELECT * FROM player WHERE room_id = $1 ORDER BY player_score DESC',
            [room]
        );
        return result;
    }
    else{
        const result = await query(
            'SELECT * FROM player WHERE room_id = (SELECT id FROM room WHERE room_code = $1) ORDER BY player_score DESC',
            [room]
        );
        return result;
    }
}

/**
    * @param player_name name of the player
    * @param room Id (if number) or Code (if string) of the room where the player is
    * @returns the player
*/
async function getPlayer(player_name: string, room: number | string) : Promise<JSON> {
    if (typeof room == 'number'){
        const result = await query(
            'SELECT * FROM player WHERE player_name = $1 AND room_id = $2',
            [player_name, room]
        );
        return result[0];
    }
    else{
        const result = await query(
            'SELECT * FROM player WHERE player_name = $1 AND room_id = (SELECT id FROM room WHERE room_code = $2)',
            [player_name, room]
        );
        return result[0];
    }
}

/**
    * @param player_name name of the player
    * @param room Id (if number) or Code (if string) of the room where the player is
    * @returns the player
*/
async function getPlayerScore(player_name: string, room: number | string) : Promise<number> {
    if (typeof room == 'number'){
        const result = await query(
            'SELECT player_score FROM player WHERE player_name = $1 AND room_id = $2',
            [player_name, room]
        );
        return result[0].player_score;
    }else{
        const result = await query(
            'SELECT player_score FROM player WHERE player_name = $1 AND room_id = (SELECT id FROM room WHERE room_code = $2)',
            [player_name, room]
        );
        return result[0].player_score;
    }
}

/**
 * Update the player's score
 * @param player_name name of the player
 * @param room Id (if number) or Code (if string) of the room where the player is
 * @param score new score of the player
 * @returns the player
*/
async function updatePlayerScore(player_name: string, room: number | string, score: number) : Promise<void> {
    if (typeof room == 'number'){
        await query(
            'UPDATE player SET player_score = $1 WHERE player_name = $2 AND room_id = $3',
            [score, player_name, room]
        );
    }else{
        await query(
            'UPDATE player SET player_score = $1 WHERE player_name = $2 AND room_id = (SELECT id FROM room WHERE room_code = $3)',
            [score, player_name, room]
        );
    }
}

/**
 * Reset the player's score to 0
 * @param player_name name of the player
 * @param room Id (if number) or Code (if string) of the room where the player is
 * @returns the player
*/
async function resetPlayerScore(player_name: string, room: number | string) : Promise<void> {
    updatePlayerScore('player_name', room, 0);
}

/**
 * Add a value to the player's score
 * @param player_name name of the player
 * @param room Id (if number) or Code (if string) of the room where the player is
 * @param add_to_score value to be added to the player's score
*/
async function addToPlayerScore(player_name: string, room: number | string, add_to_score: number) : Promise<void> {
    const current_score = await getPlayerScore(player_name, room);
    updatePlayerScore(player_name, room, current_score + add_to_score);
}

/**
 * Set the player as admin or not
 * @param player_name name of the player
 * @param room Id (if number) or Code (if string) of the room where the player is
 * @param admin if the player is admin
*/
async function setPlayerAdmin(player_name: string, room: number | string, admin: boolean) : Promise<void> {
    if (typeof room == 'number'){
        await query(
            'UPDATE player SET is_admin = $1 WHERE player_name = $2 AND room_id = $3',
            [admin, player_name, room]
        );
    }else{
        await query(
            'UPDATE player SET is_admin = $1 WHERE player_name = $2 AND room_id = (SELECT id FROM room WHERE room_code = $3)',
            [admin, player_name, room]
        );
    }
}

export {
    createPlayer,
    deletePlayer,
    getPlayers,
    getPlayer,
    getPlayerScore,
    resetPlayerScore,
    addToPlayerScore,
    setPlayerAdmin
}