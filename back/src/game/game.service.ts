import { Injectable } from '@nestjs/common';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  Language,
  Player,
  PlayerAnswer,
  Room,
  RoomStatus,
} from '@prisma/client';
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
    clientId: string,
    hostName: string,
    hostAvatar: string,
    password: string,
    maxPlayers: number,
    maxRounds: number,
    language: Language,
    roundTimer: number = 30,
  ): Promise<{ room: Room; host: Player } | undefined> {
    try {
      const room = await this.prisma.room.create({
        data: {
          code: Date.now().toString(),
          password,
          maxPlayers,
          maxRounds,
          language,
          roundTimer,
        },
        include: { players: true, messages: true },
      });

      const host = await this.prisma.player.create({
        data: {
          socketId: clientId,
          name: hostName,
          roomId: room.id,
          isHost: true,
          avatar: hostAvatar,
        },
      });

      room.players = [host];

      return { room, host };
    } catch (error) {
      this.logger.error('createRoom: Error creating room:', error);
      return;
    }
  }

  async expelPlayer(
    HostId: string,
    playerId: string,
  ): Promise<Room | undefined> {
    const host = await this.prisma.player.findUnique({
      where: { socketId: HostId, isHost: true },
    });
    if (!host || !host.roomId || !host.isHost) {
      this.logger.error('expelPlayer: Host not found or not the Host');
      return;
    }

    await this.prisma.player.delete({
      where: { id: playerId, roomId: host.roomId },
    });

    const room = await this.prisma.room.findUnique({
      where: { id: host.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      this.logger.error('expelPlayer: Room not found');
      return;
    }

    return room;
  }

  async joinRoom(
    clientId: string,
    code: string,
    name: string,
    avatar: string,
    password: string,
  ): Promise<{ room: Room; player: Player } | undefined> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { code },
        include: { players: true, messages: true },
      });

      if (!room) throw new Error('Room not found');
      if (room.password && room.password !== password) {
        this.logger.error('joinRoom: Incorrect password');
        return;
      }

      if (room.players.length >= room.maxPlayers) {
        this.logger.error('joinRoom: Room is full');
        return;
      }

      const player = await this.prisma.player.create({
        data: { name, roomId: room.id, avatar, socketId: clientId },
      });

      room.players = [...room.players, player];

      return { room, player };
    } catch (error) {
      this.logger.error('joinRoom: Error joining room:', error);
      return;
    }
  }

  async sendMessage(
    clientId: string,
    message: string,
  ): Promise<Room | undefined> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: clientId },
    });
    if (!player || !player.roomId) {
      this.logger.error('sendMessage: Player or room not found');
      return;
    }

    const newMessage = await this.prisma.message.create({
      data: {
        playerId: clientId,
        roomId: player.roomId,
        message,
      },
    });
    if (!message) {
      this.logger.error('sendMessage: Error sending message');
      return;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      this.logger.error('sendMessage: Room not found');
      return;
    }

    return room;
  }

  async getRamdomWord(language: Language): Promise<string> {
    const words = await this.prisma.word.findMany({
      where: { language },
      orderBy: { word: 'asc' },
    });
    if (words.length === 0) {
      throw new Error('No words available for the selected language');
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].word;
  }

  async startGame(hostId: string): Promise<Room | undefined> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
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
        status: 'playing',
      },
      include: { players: true, messages: true },
    });

    if (!room) {
      this.logger.error('startGame: Room not found');
      return;
    }

    this.logger.log('Round started');

    return room;
  }

  async endRound(hostId: string): Promise<
    | {
        room: Room;
        answers: PlayerAnswer[];
      }
    | undefined
  > {
    // verifica se o player tem permissão de host
    const player = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
      include: { room: true },
    });
    if (!player || !player.room || !player.roomId) {
      this.logger.error(
        'endRound: Player not found, not the Host, or not associated with a room',
      );
      return;
    }

    const room = await this.prisma.room.update({
      where: { id: player.room.id },
      include: {
        players: true,
        messages: true,
      },
      data: {
        status: RoomStatus.analyzing,
      },
    });

    if (!room) {
      this.logger.error('endRound: Room or player answers not found');
      return;
    }

    const playerAnswers = await this.prisma.playerAnswer.findMany({
      where: { roomId: room.id, round: room.currentRound },
    });

    const answers = playerAnswers;
    for (const answer of answers) {
      await this.prisma.player.update({
        where: { id: answer.playerId },
        data: { score: { increment: answer.isCorrect ? 10 : -2 } },
      });
    }

    return { room, answers };
  }

  async nextRound(hostId: string) {
    const host = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
    });

    if (!host || !host.roomId || !host.isHost) {
      this.logger.error(
        'nextRound: Host not found or not associated with a room or not the Host',
      );
      return;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: host.roomId },
      include: { players: true, messages: true },
    });

    if (!room || !room.players) {
      this.logger.error('nextRound: Room or players not found');
      return;
    }

    if (room.currentRound >= room.maxRounds) {
      await this.prisma.room.update({
        where: { id: room.id },
        include: { players: true, messages: true },
        data: { active: false, status: RoomStatus.finished },
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
      include: { players: true, messages: true },
      data: {
        currentRound: { increment: 1 },
        currentWord,
        status: RoomStatus.playing,
      },
    });

    return updatedRoom;
  }

  async exitRoom(playerId: string): Promise<Room | undefined> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: playerId },
    });
    if (!player) {
      this.logger.error('exitRoom: Player not found');
      return;
    }
    await this.prisma.player.delete({
      where: { id: player.id },
    });

    if (!player.roomId) {
      this.logger.error('exitRoom: Player not associated with a room');
      return;
    }
    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });
    if (!room || !room.players) {
      this.logger.error('exitRoom: Room not found');
      return;
    }
    if (room.players.length === 0) {
      await this.prisma.room.delete({
        where: { id: room.id },
      });
      return undefined;
    } else if (player.isHost) {
      const newHost = room.players[0];
      await this.prisma.player.update({
        where: { id: newHost.id },
        data: { isHost: true },
      });
    }

    const updatedRoom = await this.prisma.room.findFirst({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });
    if (!updatedRoom) {
      this.logger.error('exitRoom: Updated room not found');
      return;
    }
    return updatedRoom;
  }

  async processAnswer(
    playerId: string,
    track: string,
    artist: string,
    musicApi: MusicApi,
  ) {
    const player = await this.prisma.player.findUnique({
      where: { socketId: playerId },
    });

    if (!player || !player.roomId) {
      this.logger.error(
        'processAnswer: Player not found or not associated with a room',
      );
      return;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
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

    await this.prisma.playerAnswer.deleteMany({
      where: { roomId: player.roomId, playerId, round: room.currentRound },
    });

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

  async getRoomInfo(clientId){
    const player = await this.prisma.player.findUnique({
      where: { socketId: clientId },
      include: { room: true },
    });
    if (!player || !player.roomId) {
      this.logger.error('getRoomInfo: Player not found or not associated with a room');
      return;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      this.logger.error('getRoomInfo: Room not found');
      return;
    }

    return room;
  }
}
