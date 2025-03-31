import { Injectable } from '@nestjs/common';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { Language, Player, PlayerAnswer, Room } from '@prisma/client';
import { MusicApi } from '../api-requests/music-api.enum';
import { Logger } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private apiRequestsService: ApiRequestsService,
    private readonly logger: Logger,
  ) {}

  async createRoom(
    hostName: string,
    hostAvatar: string,
    roomPassword: string,
    maxPlayers: number,
    maxRounds: number,
    language: Language,
  ): Promise<{ room: Room; host: Player } | undefined> {
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

      return { room, host };
    } catch (error) {
      this.logger.error('createRoom: Error creating room:', error);
      return;
    }
  }

  async joinRoom(
    code: string,
    name: string,
    avatar: string,
    password: string,
  ): Promise<{ room: Room; player: Player } | undefined> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { code },
        include: { players: true },
      });

      if (!room) throw new Error('Room not found');
      if (room.password && room.password !== password) {
        this.logger.error('joinRoom: Incorrect password');
        return;
      }

      const players = await this.prisma.player.findMany({
        where: { roomId: room.id },
      });

      if (players.length >= room.maxPlayers) {
        this.logger.error('joinRoom: Room is full');
        return;
      }

      const player = await this.prisma.player.create({
        data: { name, roomId: room.id, avatar },
      });

      room.players = [...room.players, player];

      return { room, player };
    } catch (error) {
      this.logger.error('joinRoom: Error joining room:', error);
      return;
    }
  }

  getRamdomWord(language: Language): Promise<string> {
    return this.prisma.word
      .findMany({
        where: { language },
        orderBy: { word: 'asc' },
      })
      .then((words) => {
        if (words.length === 0) {
          throw new Error('No words available for the selected language');
        }
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].word;
      });
  }

  async startGame(hostId: string): Promise<Room | undefined> {
    const player = await this.prisma.player.findUnique({
      where: { id: hostId, isHost: true },
      include: { room: true },
    });

    if (!player || !player.room || !player.roomId) {
      this.logger.error(
        'startGame: Player not found, not the Host, or not associated with a room',
      );
      return;
    }
    if (!player) {
      this.logger.error('startGame: Player not found or not the Host');
      return;
    }

    const currentWord = await this.getRamdomWord(player.room.language);
    const room = await this.prisma.room.update({
      where: {
        id: player.roomId,
      },
      data: {
        active: true,
        currentRound: 1,
        currentWord,
        roundTimer: 30,
      },
      include: { players: true },
    });

    if (!room) {
      this.logger.error('startGame: Room not found');
      return;
    }

    return room;
  }

  async endRound(hostId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: hostId, isHost: true },
      include: { room: true },
    });
    if (!player || !player.room || !player.roomId) {
      this.logger.error(
        'endRound: Player not found, not the Host, or not associated with a room',
      );
      return;
    }

    const room = await this.prisma.room.findFirst({
      where: { id: player.room.id },
      include: {
        playerAnswers: {
          where: { round: player.room.currentRound },
        },
        players: true,
      },
    });

    if (!room || !room.playerAnswers) {
      this.logger.error('endRound: Room or player answers not found');
      return;
    }

    const answers = room.playerAnswers;
    for (const answer of answers) {
      await this.prisma.player.update({
        where: { id: answer.playerId },
        data: { score: { increment: answer.isCorrect ? 10 : -2 } },
      });
    }

    return { room };
  }

  async nextRound(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { players: true },
    });

    if (!room || !room.players) {
      this.logger.error('nextRound: Room or players not found');
      return;
    }

    if (room.currentRound >= room.maxRounds) {
      await this.prisma.room.update({
        where: { id: room.id },
        data: { active: false },
      });
      return room;
    }

    const words = await this.prisma.word.findMany({
      where: { language: room.language },
    });
    if (words.length === 0) {
      this.logger.error(
        'nextRound: No words available for the selected language',
      );
    }
    const currentWord = words[Math.floor(Math.random() * words.length)].word;

    const updatedRoom = await this.prisma.room.update({
      where: { id: room.id },
      data: {
        currentRound: { increment: 1 },
        currentWord,
      },
    });

    return updatedRoom;
  }

  async processAnswer(
    roomCode: string,
    playerId: string,
    track: string,
    artist: string,
    musicApi: MusicApi,
  ) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { players: true },
    });

    if (!room) {
      this.logger.error('processAnswer: Room not found');
      return;
    }

    if (!room.currentWord) {
      this.logger.error('processAnswer: Current word not found');
      return;
    }

    const lyrics = await this.apiRequestsService.getLyrics(
      track,
      artist,
      musicApi,
    );

    if (!lyrics || typeof lyrics !== 'string') {
      this.logger.error('processAnswer: Lyrics not found');
      return;
    }

    // Valida se a palavra da rodada está presente na letra da música
    const isCorrect = lyrics
      .toLowerCase()
      .includes(String(room.currentWord).toLowerCase());

    const playerAnswer = await this.apiRequestsService.searchTracks_Deezer(
      track,
      artist,
    );

    // Salva a resposta do jogador no banco de dados
    await this.prisma.playerAnswer.create({
      data: {
        playerId,
        roomId: room.id,
        round: room.currentRound,
        track: playerAnswer[0].track_name,
        artist: playerAnswer[0].artist,
        albumImage: playerAnswer[0].album_image,
        preview: playerAnswer[0].preview,
        isCorrect,
      },
    });

    return;
  }
}
