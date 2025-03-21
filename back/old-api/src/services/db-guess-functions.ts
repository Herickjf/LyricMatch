// // Pega a função de query do arquivo db-query.ts
// import { query } from './db-query';

// /*
//     THIS FILE CONTAINS TO MANIPULATE THE GUESS TABLE
// */

// interface Guess {
//     artist_name: string;
//     song_name: string;
//     is_correct: boolean;
//     selected_music_id: number;
//     selected_music_api: string;
//     player_id: number;
//     room_id: number;
// }

// /**
//  * 
//  * @param guess object with the following attributes:
//  *   - artist_name: name of the artist
//  *   - song_name: name of the song
//  *   - is_correct: if the guess is correct
//  *   - round_number: number of the round
//  *   - selected_music_id: id of the selected music
//  *   - selected_music_api: api of the selected music
//  *   - player_id: id of the player who made the guess
//  *   - room_id: id of the room where the guess was made
//  * @returns the guess created
//  */
// async function createGuess(guess: Guess) : Promise<Guess> {
//     const result = await query(
//         'INSERT INTO guess (artist_name, song_name, is_correct, selected_music_id, selected_music_api, player_id, room_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
//         [
//             guess.artist_name, 
//             guess.song_name, 
//             guess.is_correct, 
//             guess.selected_music_id, 
//             guess.selected_music_api, 
//             guess.player_id, 
//             guess.room_id
//         ] 
//     );
    
//     // Retorna o json completo do guess criado
//     return result[0];
// }

// /**
//  * 
//  * @param room Id (if number) or Code (if string) of the room where the guesses are
//  * @returns the list of guesses
//  */
// async function deleteGuesses(room: number | string) : Promise<void> {
//     if (typeof room == 'number'){
//         await query(
//             'DELETE FROM guess WHERE room_id = $1',
//             [room]
//         );
//     } else {
//         await query(
//             'DELETE FROM guess WHERE room_id = (SELECT id FROM room WHERE room_code = $1)',
//             [room]
//         );
//     }
// }

// /**
//  * 
//  * @param room Id (if number) or Code (if string) of the room where the guesses are
//  * @returns the list of guesses
//  */
// async function getGuesses(room: number | string) : Promise<JSON[]> {
//     if (typeof room == 'number'){
//         return await query(
//             'SELECT * FROM guess WHERE room_id = $1',
//             [room]
//         );
//     } else {
//         return await query(
//             'SELECT * FROM guess WHERE room_id = (SELECT id FROM room WHERE room_code = $1)',
//             [room]
//         );
//     }
// }

// /**
//  * 
//  * @param player Id (if number) or Name (if string) of the player who made the guess
//  * @param room Id (if number) or Code (if string) of the room where the guess was made
//  * @returns the last guess of the player in the room
//  */
// async function getGuessByPlayer(player: number | string, room: number | string){
//     if (typeof room == 'number'){
//         if (typeof player == 'number'){
//             return await query(
//                 'SELECT * FROM guess WHERE player_id = $1 AND room_id = $2',
//                 [player, room]
//             );
//         } else {
//             return await query(
//                 'SELECT * FROM guess WHERE player_id = (SELECT id FROM player WHERE player_name = $1) AND room_id = $2',
//                 [player, room]
//             );
//         }
//     } else {
//         if (typeof player == 'number'){
//             return await query(
//                 'SELECT * FROM guess WHERE player_id = $1 AND room_id = (SELECT id FROM room WHERE room_code = $2)',
//                 [player, room]
//             );
//         } else {
//             return await query(
//                 'SELECT * FROM guess WHERE player_id = (SELECT id FROM player WHERE player_name = $1) AND room_id = (SELECT id FROM room WHERE room_code = $2)',
//                 [player, room]
//             );
//         }
//     }
// }

// /**
//  * Returns the music info of the last guess of all players of a room
//  * @param room Id (if number) or Code (if string) of the room where the guess was made
//  * @param player Id (if number) or Name (if string) of the player who made the guess
//  * @returns the music info of the last guesses given by the players in the room
//  * - selected_music_id: id of the selected music
//  * - selected_music_api: api of the selected music
// */
// async function getGuessesMusicInfo(room: number | string){
//     if (typeof room == 'number'){
//         return await query(
//             'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = $1',
//             [room]
//         );
//     } else {
//         return await query(
//             'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = (SELECT id FROM room WHERE room_code = $1)',
//             [room]
//         );
//     }
// }

// /**
//  * Returns the music info of the last guess of a player in a room
//  * @param room Id (if number) or Code (if string) of the room where the guess was made
//  * @param player Id (if number) or Name (if string) of the player who made the guess
//  * @returns the music info of the last guess of the player in the room
//  * - selected_music_id: id of the selected music
//  * - selected_music_api: api of the selected music
// */
// async function getGuessMusicInfo(room: number | string, player: number|string){
//     if (typeof room == 'number'){
//         if (typeof player == 'number'){
//             return await query(
//                 'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = $1 AND player_id = $2',
//                 [room, player]
//             );
//         } else {
//             return await query(
//                 'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = $1 AND player_id = (SELECT id FROM player WHERE player_name = $2)',
//                 [room, player]
//             );
//         }
//     } else {
//         if (typeof player == 'number'){
//             return await query(
//                 'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = (SELECT id FROM room WHERE room_code = $1) AND player_id = $2',
//                 [room, player]
//             );
//         } else {
//             return await query(
//                 'SELECT selected_music_id, selected_music_api FROM guess WHERE room_id = (SELECT id FROM room WHERE room_code = $1) AND player_id = (SELECT id FROM player WHERE player_name = $2)',
//                 [room, player]
//             );
//         }
//     }
// }
