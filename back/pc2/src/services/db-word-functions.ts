// Take the function 'query' from the archive db-query.ts
import { query } from './db-query';

/*
    THIS FILE CONTAINS TO MANIPULATE THE WORD TABLE
*/

interface Word{
    word: string;
    language: string;
}

/**
 * Add a word to the database, if it doesn't exist yet
 * @param word the structure word to be added, with the following attributes:
 *  - word: the word to be added
 *  - language: the language of the word
 * @returns the json of the word added
*/
async function addWord(word: Word) : Promise<Word>{
    if(await wordExists(word)){
        return word;
    }
    const result = await query(
        'INSERT INTO word (word, language) VALUES ($1, $2) RETURNING *',
        [word.word, word.language]
    );
    return result[0];
}

/**
 * Delete a word from the database
 * @param word the word structure to be deleted, with the following attributes:
 * - word: the word to be deleted
 * - language: the language of the word
 * @returns the json of the word deleted
*/
async function deleteWord(word: Word) : Promise<Word>{
    const result = await query(
        'DELETE FROM word WHERE word = $1 AND language = $2 RETURNING *',
        [word.word, word.language]
    );
    return result[0];
}

/**
 * Get all words from the database of a specific language
 * @param language the language of the words
 * @returns all words from the database
*/
async function getWords(language: string) : Promise<Word[]>{
    const result = await query(
        'SELECT * FROM word WHERE language = $1',
        [language]
    );
    return result;
}

/**
  * Verify if the word exists in the database
  * @param word the structure word to be verified, with the following attributes:
  *  - word: the word to be verified
  *  - language: the language of the word
  * @param language the language of the word
  * @returns true if the word exists, false otherwise
*/
async function wordExists(word: Word) : Promise<boolean>{
    const result = await query(
        'SELECT * FROM word WHERE word = $1 AND language = $2',
        [word.word, word.language]
    );
    return result.length > 0;
}

/**
 * 
 * @param language the language of the word
 * @param already_sorted the id's or words that are already sorted
 * @returns the word that was sorted
 */
async function getNewWord(language: string, already_sorted: number[] | string[] | undefined = undefined) : Promise<String> {
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

export{
    addWord,
    deleteWord,
    getWords,
    wordExists,
    getNewWord
}