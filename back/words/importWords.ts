import * as fs from 'fs';
import * as path from 'path';
import { Language, PrismaClient } from '@prisma/client';

// Instanciando o Prisma Client
const prisma = new PrismaClient();

// Função para ler um arquivo e retornar as palavras em um array
const readFile = (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Retorna as palavras do arquivo como um array
        resolve(
          data
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
        );
      }
    });
  });
};

// Função para inserir as palavras no banco de dados
const insertWords = async (words: string[], language: Language) => {
  for (const word of words) {
    await prisma.word.create({
      data: {
        word,
        language,
      },
    });
  }
  console.log(`Palavras ${language} inseridas com sucesso!`);
};

// Função principal que lê os três arquivos e insere as palavras no banco
const importWords = async () => {
  try {
    const files: {
      [key in Language]: string;
    } = {
      EN: path.join(__dirname, 'english.txt'),
      PT: path.join(__dirname, 'portuguese.txt'),
      ES: path.join(__dirname, 'spanish.txt'),
    };

    const allWords: string[] = [];
    for (const file in files) {
      const words = await readFile(files[file]);
      allWords.push(...words);
      await insertWords(words, file as Language);
    }

    // Inserir as palavras no banco
  } catch (error) {
    console.error('Erro ao importar palavras:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Executar a função somente quando chamado
importWords();
