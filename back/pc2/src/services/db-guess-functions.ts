// Pega a função de query do arquivo db-query.ts
import { query } from './db-query';

/*
    THIS FILE CONTAINS TO MANIPULATE THE GUESS TABLE
*/

interface Guess {
    artist_name: string;
    song_name: string;
    is_correct: boolean;
    round_number: number;
    selected_music_id: number;
    selected_music_api: string;
    player_id: number;
    room_id: number;
}

/**
 * 
 * @param guess object with the following attributes:
 *   - artist_name: name of the artist
 *   - song_name: name of the song
 *   - is_correct: if the guess is correct
 *   - round_number: number of the round
 *   - selected_music_id: id of the selected music
 *   - selected_music_api: api of the selected music
 *   - player_id: id of the player who made the guess
 *   - room_id: id of the room where the guess was made
 * @returns the guess created
 */
async function createGuess(guess: Guess) : Promise<Guess> {
    const result = await query(
        'INSERT INTO guess (artist_name, song_name, is_correct, round_number, selected_music_id, selected_music_api, player_id, room_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
            guess.artist_name, 
            guess.song_name, 
            guess.is_correct, 
            guess.round_number, 
            guess.selected_music_id, 
            guess.selected_music_api, 
            guess.player_id, 
            guess.room_id
        ] 
    );
    
    // Retorna o json completo do guess criado
    return result[0];
}