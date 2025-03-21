// Pega a função de query do arquivo db-query.ts
import { query } from './db-query';

/*
    THIS FILE CONTAINS TO MANIPULATE THE ROOM TABLE
*/

interface Room{
    room_code: string;
    room_password: string;
    room_state: string;
    room_language: string;
    max_players: number;
    max_rounds: number;
    current_round?: number;
    current_players?: number;
    current_word?: string;
}

interface Word{
    word: string;
    language: string;
}