import { Injectable } from '@nestjs/common';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { Language } from '@prisma/client';
import { MusicApi } from '../api-requests/music-api.enum';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private apiRequestsService: ApiRequestsService,
  ) {}

  async createRoom(
    hostName: string,
    hostAvatar: string,
    roomPassword: string,
    maxPlayers: number,
    maxRounds: number,
    language: Language,
  ): Promise<{ code: string; host: any }> {
    try {
      let roomCode: string = '';
      let isUnique = false;

      // Gera um código único
      while (!isUnique) {
        roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existingRoom = await this.prisma.room.findUnique({
          where: { code: roomCode },
        });
        if (!existingRoom) {
          isUnique = true;
        }
      }

      const room = await this.prisma.room.create({
        data: {
          code: roomCode,
          password: roomPassword,
          maxPlayers,
          maxRounds,
          language,
        },
      });

      const host = await this.prisma.player.create({
        data: {
          name: hostName,
          roomId: room.id,
          isHost: true,
          avatar: hostAvatar,
        },
      });

      return { code: room.code, host };
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Could not create room');
    }
  }

  async joinRoom(code: string, name: string, avatar: string, password: string) {
    try {
      const room = await this.prisma.room.findUnique({
        where: { code },
        select: { id: true, password: true, maxPlayers: true, code: true },
      });

      if (!room) throw new Error('Room not found');
      if (room.password && room.password !== password)
        throw new Error('Invalid password');

      const players = await this.prisma.player.findMany({
        where: { roomId: room.id },
      });

      if (players.length >= room.maxPlayers) throw new Error('Room is full');

      const user = await this.prisma.player.create({
        data: { name, roomId: room.id, avatar },
      });

      return { room, user };
    } catch (error) {
      console.error('Error joining room:', error);
      throw new Error('Could not join room');
    }
  }

  async startGame(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { players: true },
    });

    if (!room) throw new Error('Room not found');

    const words = await this.prisma.word.findMany({
      where: { language: room.language },
    });
    if (words.length === 0) {
      throw new Error('No words available for the selected language');
    }
    const currentWord = words[Math.floor(Math.random() * words.length)].word;

    const gameState = await this.prisma.gameState.create({
      data: {
        currentRound: 1,
        currentWord,
        timer: 30,
        roomId: room.id,
      },
    });

    await this.prisma.room.update({
      where: { id: room.id },
      data: { active: true },
    });

    return {
      currentRound: gameState.currentRound,
      maxRounds: room.maxRounds,
      players: room.players.map((player) => ({
        id: player.id,
        name: player.name,
        score: 0,
      })),
      currentWord: gameState.currentWord,
      timer: gameState.timer,
    };
  }

  async endRound(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: {
        gameState: { include: { playerAnswers: true } },
        players: true,
      },
    });

    if (!room || !room.gameState) throw new Error('Game not found');

    const answers = room.gameState!.playerAnswers.filter(
      (answer) => answer.round === room.gameState!.currentRound,
    );

    const results = answers.map((answer) => ({
      playerId: answer.playerId,
      track: answer.track,
      artist: answer.artist,
      albumImage: answer.albumImage,
      previewUrl: answer.preview,
      isCorrect: answer.isCorrect,
    }));

    // Atualiza a pontuação dos jogadores
    for (const answer of answers) {
      if (answer.isCorrect) {
        await this.prisma.player.update({
          where: { id: answer.playerId },
          data: { score: { increment: 10 } },
        });
      }
    }

    return { round: room.gameState.currentRound, results };
  }

  async nextRound(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { gameState: true, players: true },
    });

    if (!room || !room.gameState) throw new Error('Game not found');

    if (room.gameState.currentRound >= room.maxRounds) {
      await this.prisma.room.update({
        where: { id: room.id },
        data: { active: false },
      });
      return { gameOver: true, topPlayers: this.getTopPlayers(room.players) };
    }

    const words = await this.prisma.word.findMany({
      where: { language: room.language },
    });
    if (words.length === 0) {
      throw new Error('No words available for the selected language');
    }
    const currentWord = words[Math.floor(Math.random() * words.length)].word;

    const updatedGameState = await this.prisma.gameState.update({
      where: { id: room.gameState.id },
      data: {
        currentRound: room.gameState.currentRound + 1,
        currentWord,
        timer: 30,
      },
    });

    return {
      currentRound: updatedGameState.currentRound,
      currentWord: updatedGameState.currentWord,
      timer: updatedGameState.timer,
    };
  }

  private getTopPlayers(players: any[]) {
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    return sortedPlayers.slice(0, 3);
  }

  async processAnswer(
    roomCode: string,
    playerId: string,
    track: string,
    artist: string,
    musicApi: MusicApi,
  ): Promise<{ isCorrect: boolean; player?: any }> {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { gameState: true },
    });

    if (!room || !room.gameState)
      throw new Error('Room or game state not found');

    const currentWord = room.gameState.currentWord;
    if (!currentWord) {
      throw new Error('Current word is not set in the game state');
    }

    const lyrics = await this.apiRequestsService.getLyrics(
      track,
      artist,
      musicApi,
    );

    if (!lyrics || typeof lyrics !== 'string') {
      throw new Error('Failed to fetch lyrics');
    }

    // Valida se a palavra da rodada está presente na letra da música
    const isCorrect = lyrics.toLowerCase().includes(currentWord.toLowerCase());

    const playerAnswer = await this.apiRequestsService.searchTracks_Deezer(
      track,
      artist,
    );

    // Salva a resposta do jogador no banco de dados
    await this.prisma.playerAnswer.create({
      data: {
        playerId,
        gameStateId: room.gameState.id,
        round: room.gameState.currentRound,
        track: playerAnswer[0].track_name,
        artist: playerAnswer[0].artist,
        albumImage: playerAnswer[0].album_image,
        preview: playerAnswer[0].preview,
        isCorrect,
      },
    });

    let player;
    if (isCorrect) {
      // Atualiza a pontuação do jogador
      player = await this.prisma.player.update({
        where: { id: playerId },
        data: { score: { increment: 10 } },
      });
    }

    return { isCorrect, player };
  }
}
