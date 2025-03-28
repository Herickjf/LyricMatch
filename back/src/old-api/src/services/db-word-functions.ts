// // Take the function 'query' from the archive db-query.ts
// import { query } from './db-query';

// /*
//     THIS FILE CONTAINS TO MANIPULATE THE WORD TABLE
// */

// interface Word{
//     word: string;
//     language: string;
// }

// /**
//  * Add a word to the database, if it doesn't exist yet
//  * @param word the structure word to be added, with the following attributes:
//  *  - word: the word to be added
//  *  - language: the language of the word
//  * @returns the json of the word added
// */
// async function addWord(word: Word) : Promise<Word>{
//     if(await wordExists(word)){
//         return word;
//     }
//     const result = await query(
//         'INSERT INTO word (word, language) VALUES ($1, $2) RETURNING *',
//         [word.word, word.language]
//     );
//     return result[0];
// }

// /**
//  * Delete a word from the database
//  * @param word the word structure to be deleted, with the following attributes:
//  * - word: the word to be deleted
//  * - language: the language of the word
//  * @returns the json of the word deleted
// */
// async function deleteWord(word: Word) : Promise<Word>{
//     const result = await query(
//         'DELETE FROM word WHERE word = $1 AND language = $2 RETURNING *',
//         [word.word, word.language]
//     );
//     return result[0];
// }

// /**
//  * Get all words from the database of a specific language
//  * @param language the language of the words
//  * @returns all words from the database
// */
// async function getWords(language: string) : Promise<Word[]>{
//     const result = await query(
//         'SELECT * FROM word WHERE language = $1',
//         [language]
//     );
//     return result;
// }

// /**
//   * Verify if the word exists in the database
//   * @param word the structure word to be verified, with the following attributes:
//   *  - word: the word to be verified
//   *  - language: the language of the word
//   * @param language the language of the word
//   * @returns true if the word exists, false otherwise
// */
// async function wordExists(word: Word) : Promise<boolean>{
//     const result = await query(
//         'SELECT * FROM word WHERE word = $1 AND language = $2',
//         [word.word, word.language]
//     );
//     return result.length > 0;
// }

// /**
//  * 
//  * @param language the language of the word
//  * @param room Id (if it is a number) or Code (if it is a string) of the room
//  * @returns the word that was sorted
//  */
// async function getNewWord(language: string, room: number | string): Promise<JSON>{
//     if(typeof room === 'number'){
//         let word = await query(
//             'SELECT * FROM word WHERE language = $1 AND word NOT IN (SELECT word FROM word_sorted WHERE language = $1 AND room_id = $2) ORDER BY RANDOM() LIMIT 1',
//             [language, room]
//         )[0];
//         return word;
//     }else{
//         let word = await query(
//             'SELECT * FROM word WHERE language = $1 AND word NOT IN (SELECT word FROM word_sorted WHERE language = $1 AND room_id = (SELECT id FROM room WHERE room_code = $2)) ORDER BY RANDOM() LIMIT 1',
//             [language, room]
//         )[0];
//         return word;
//     }
// }

// /**
//  * 
//  * @param word the word to be registered
//  * @param room Id (if it is a number) or Code (if it is a string) of the room
// */
// async function registrateWord(word: string, room: number | string): Promise<void>{
//     if(typeof room === 'number'){
//         await query(
//             'INSERT INTO word_sorted (word, room_id) VALUES ($1, $2, $3)',
//             [word, room]
//         );
//     }else{
//         await query(
//             'INSERT INTO word_sorted (word, language, room_id) VALUES ($1, $2, (SELECT id FROM room WHERE room_code = $3))',
//             [word, room]
//         );
//     }
// }

// /**
//  * Clean the word_sorted of a room
//  * @param room the room to be cleaned
// */
// async function cleanWordSorted(room: number | string): Promise<void>{
//     if(typeof room === 'number'){
//         await query(
//             'DELETE FROM word_sorted WHERE room_id = $1',
//             [room]
//         );
//     }else{
//         await query(
//             'DELETE FROM word_sorted WHERE room_id = (SELECT id FROM room WHERE room_code = $1)',
//             [room]
//         );
//     }
// }

// export{
//     addWord,
//     deleteWord,
//     getWords,
//     wordExists,
//     getNewWord,
//     registrateWord,
//     cleanWordSorted
// }