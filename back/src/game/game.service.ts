import { Injectable, Logger } from '@nestjs/common';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { Language, Player, Room, RoomStatus } from '@prisma/client';
import { Counter, Histogram } from 'prom-client';
import { Inject } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiRequestsService: ApiRequestsService,
    private readonly logger: Logger,
    @InjectMetric('rooms_created_total')
    private roomsCreated: Counter<string>,

    @InjectMetric('players_joined_total')
    private playersJoined: Counter<string>,

    @InjectMetric('messages_sent_total')
    private messagesSent: Counter<string>,

    @InjectMetric('rounds_started_total')
    private roundsStarted: Counter<string>,

    @InjectMetric('rounds_ended_total')
    private roundsEnded: Counter<string>,

    @InjectMetric('game_duration_seconds')
    private gameDuration: Histogram<string>,
  ) {}

  async createRoom(
    clientId: string,
    hostName: string,
    hostAvatar: string,
    password: string,
    maxPlayers: number,
    maxRounds: number,
    language: Language,
    clientIp: any = null,
    roundTimer: number = 30,
  ): Promise<{ room: Room; host: Player }> {
    try {
      const code = Array.from(
        { length: 6 },
        () =>
          Math.random() < 0.5
            ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Gera uma letra aleatória (A-Z)
            : Math.floor(Math.random() * 10), // Gera um número aleatório (0-9)
      ).join('');
      const hashedPassword = await bcrypt.hash(password, 10); // O número 10 é o salt rounds

      const room = await this.prisma.room.create({
        data: {
          code,
          password: hashedPassword,
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

      if (clientIp != null && clientIp.ip != null) {
        const newLocalization = await this.prisma.localization.create({
          data: {
            ip: clientIp.ip,
            city: clientIp.city,
            longitude: clientIp.loc.split(',')[1],
            latitude: clientIp.loc.split(',')[0],
            playerId: host.id,
          },
        });
      }

      room.players = [host];

      // Incrementa a métrica de salas criadas
      this.roomsCreated.inc();

      return { room, host };
    } catch (error) {
      this.logger.error('createRoom: Error creating room:', error);
      throw new Error('createRoom: Error creating room');
    }
  }

  async expelPlayer(HostId: string, playerId: string): Promise<Room> {
    const host = await this.prisma.player.findUnique({
      where: { socketId: HostId, isHost: true },
    });
    if (!host || !host.roomId || !host.isHost) {
      throw new Error('expelPlayer: Host not found or not the Host');
    }

    await this.prisma.player.delete({
      where: { id: playerId, roomId: host.roomId },
    });

    const room = await this.prisma.room.findUnique({
      where: { id: host.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('expelPlayer: Room not found');
    }

    return room;
  }

  async joinRoom(
    clientId: string,
    code: string,
    name: string,
    avatar: string,
    password: string,
    clientIp: any = null,
  ): Promise<{ room: Room; player: Player }> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { code },
        include: { players: true, messages: true },
      });

      if (!room) throw new Error('Room not found');

      const isPasswordValid = await bcrypt.compare(password, room.password);
      if (!isPasswordValid) {
        throw new Error('joinRoom: Incorrect password');
      }

      if (room.players.length >= room.maxPlayers) {
        throw new Error('joinRoom: Room is full');
      }

      const player = await this.prisma.player.create({
        data: { name, roomId: room.id, avatar, socketId: clientId },
      });

      if (clientIp) {
        const newLocalization = await this.prisma.localization.create({
          data: {
            ip: clientIp.ip,
            city: clientIp.city,
            longitude: clientIp.loc.split(',')[1],
            latitude: clientIp.loc.split(',')[0],
            playerId: player.id,
          },
        });
      }

      room.players = [...room.players, player];

      // Incrementa a métrica de jogadores que se juntaram à sala
      this.playersJoined.inc();

      return { room, player };
    } catch (error) {
      this.logger.error('joinRoom: Error joining room:', error);
      throw new Error('joinRoom: Error joining room');
    }
  }

  async sendMessage(clientId: string, message: string): Promise<Room> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: clientId },
    });
    if (!player || !player.roomId) {
      throw new Error('sendMessage: Player or room not found');
    }

    const newMessage = await this.prisma.message.create({
      data: {
        playerId: player.id,
        roomId: player.roomId,
        message: message,
      },
    });
    if (!newMessage) {
      throw new Error('sendMessage: Error sending message');
    }

    // Incrementa a métrica de mensagens enviadas
    this.messagesSent.inc();

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('sendMessage: Room not found');
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

  async startGame(hostId: string): Promise<Room> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
      include: { room: true },
    });

    if (!player || !player.room || !player.roomId) {
      throw new Error(
        'startGame: Player not found, not the Host, or not associated with a room',
      );
    }

    let room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
    });

    if (!room) {
      throw new Error('startGame: Room not found');
    }

    let tries = 0;
    let currentWord: string;
    do {
      currentWord = await this.getRamdomWord(player.room.language);
      tries++;
      if (tries > 10) {
        throw new Error(
          'startGame: Too many attempts to find a word not in prevWords',
        );
      }
    } while (room.prevWords.includes(currentWord));

    room = await this.prisma.room.update({
      where: {
        id: player.roomId,
      },
      data: {
        currentRound: 1,
        currentWord,
        prevWords: {
          push: currentWord,
        },
        status: 'playing',
      },
      include: { players: true, messages: true },
    });

    // Incrementa a métrica de rodadas iniciadas
    this.roundsStarted.inc();

    // Opcional: marque a duração da partida (exemplo, se você medir o tempo total do jogo)
    // this.gameDurationHistogram.observe(durationEmSegundos);

    this.logger.log('Round started');

    return room;
  }

  async endRound(hostId: string): Promise<{ room: Room; answers: any[] }> {
    const player = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
      include: { room: true },
    });
    if (!player || !player.room || !player.roomId) {
      throw new Error(
        'endRound: Player not found, not the Host, or not associated with a room',
      );
    }

    let room = await this.prisma.room.update({
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
      throw new Error('endRound: Room or player answers not found');
    }

    const playerAnswers = await this.prisma.playerAnswer.findMany({
      where: { roomId: room.id, round: room.currentRound },
    });

    // Incrementa a métrica de rodadas encerradas
    this.roundsEnded.inc();

    // Atualiza os scores dos jogadores
    for (const answer of playerAnswers) {
      await this.prisma.player.update({
        where: { id: answer.playerId },
        data: { score: { increment: answer.isCorrect ? 10 : 0 } },
      });
    }

    let updatedRoom = await this.prisma.room.findUnique({
      where: { id: room.id },
      include: {
        players: true,
        messages: true,
      },
    });

    if (updatedRoom) {
      room = updatedRoom;
    }
    return { room, answers: playerAnswers };
  }

  async nextRound(hostId: string) {
    const host = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
    });

    if (!host || !host.roomId || !host.isHost) {
      throw new Error(
        'nextRound: Host not found or not associated with a room or not the Host',
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { id: host.roomId },
      include: { players: true, messages: true },
    });

    if (!room || !room.players) {
      throw new Error('nextRound: Room or players not found');
    }

    // Limpa as tentativas passadas:
    await this.prisma.playerAnswer.deleteMany({
      where: { roomId: room.id },
    });

    if (room.currentRound <= room.maxRounds) {
      const words = await this.prisma.word.findMany({
        where: { language: room.language },
      });
      if (words.length === 0) {
        throw new Error(
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
    } else {
      await this.prisma.room.update({
        where: { id: room.id },
        include: { players: true, messages: true },
        data: { status: RoomStatus.finished },
      });
      return room;
    }
  }

  async resetRoom(hostId: string): Promise<Room> {
    const host = await this.prisma.player.findUnique({
      where: { socketId: hostId, isHost: true },
    });

    if (!host || !host.roomId || !host.isHost) {
      throw new Error(
        'resetRoom: Host not found or not associated with a room or not the Host',
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { id: host.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('resetRoom: Room not found');
    }

    await this.prisma.playerAnswer.deleteMany({
      where: { roomId: room.id },
    });

    const resetRoom = await this.prisma.room.update({
      where: { id: room.id },
      data: {
        currentRound: 0,
        currentWord: null,
        status: RoomStatus.waiting,
      },
      include: { players: true, messages: true },
    });

    const players = await this.prisma.player.updateManyAndReturn({
      where: { roomId: room.id },
      data: {
        score: 0,
      },
    });

    resetRoom.players = players;

    await this.prisma.player.updateMany({
      where: { roomId: room.id },
      data: { score: 0 },
    });

    return resetRoom;
  }

  async exitRoom(socketId: string): Promise<Room | null> {
    const player = await this.prisma.player.findUnique({
      where: { socketId },
    });

    if (!player) {
      return null;
    }

    const { id: playerId, roomId, isHost } = player;

    if (!roomId) {
      throw new Error('exitRoom: Player not associated with a room');
    }

    // Busca a sala atualizada antes de deletar o player
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('exitRoom: Room not found');
    }

    // Deleta o player
    await this.prisma.player.delete({
      where: { id: playerId },
    });

    const remainingPlayers = room.players.filter((p) => p.id !== playerId);

    // Se não sobrou ninguém, deleta a sala
    if (remainingPlayers.length === 0) {
      const deletedRoom = await this.prisma.room.delete({
        where: { id: roomId },
      });
      return deletedRoom;
    }

    // Se o player era host, transfere para outro
    if (isHost) {
      const newHost = remainingPlayers[0];
      await this.prisma.player.update({
        where: { id: newHost.id },
        data: { isHost: true },
      });
    }

    // Retorna a sala atualizada
    const updatedRoom = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true, messages: true },
    });

    if (!updatedRoom) {
      throw new Error('exitRoom: Updated room not found');
    }

    return updatedRoom;
  }

  async processAnswer(
    playerId: string,
    track: string,
    artist: string,
    index: string,
  ) {
    const playerExists = await this.prisma.player.findUnique({
      where: { socketId: playerId },
    });
    if (!playerExists) {
      throw new Error(
        `processAnswer: Player with socketId ${playerId} not found`,
      );
    }

    if (!playerExists || !playerExists.roomId) {
      throw new Error(
        'processAnswer: Player not found or not associated with a room',
      );
    }

    const roomExists = await this.prisma.room.findUnique({
      where: { id: playerExists.roomId },
    });
    if (!roomExists) {
      throw new Error(
        `processAnswer: Room with ID ${playerExists.roomId} not found`,
      );
    }

    if (!roomExists.currentWord) {
      throw new Error('processAnswer: Current word not found');
    }

    const lyrics = await this.apiRequestsService.getLyrics(track, artist);

    if (!lyrics || typeof lyrics !== 'string') {
      throw new Error('processAnswer: Lyrics not found');
    }

    // Valida se a palavra da rodada está presente na letra da música
    const isCorrect = lyrics
      .toLowerCase()
      .includes(String(roomExists.currentWord).toLowerCase());

    const playerAnswer = await this.apiRequestsService.searchTrack_Deezzer_byId(
      String(index),
    );

    if (!playerAnswer || playerAnswer.length === 0) {
      throw new Error('processAnswer: Player answer not found');
    }

    // deleta as tentativas de resposta do jogador na rodada atual
    await this.prisma.playerAnswer.deleteMany({
      where: {
        roomId: playerExists.roomId,
        playerId: playerExists.id,
        round: roomExists.currentRound,
      },
    });

    // Salva a resposta do jogador no banco de dados
    await this.prisma.playerAnswer.create({
      data: {
        playerId: playerExists.id,
        roomId: roomExists.id,
        round: roomExists.currentRound,
        track: playerAnswer.track_name,
        artist: playerAnswer.artist,
        albumImage: playerAnswer.album_image,
        preview: playerAnswer.preview,
        isCorrect,
      },
    });
  }

  async getRoomInfo(clientId: string) {
    const player = await this.prisma.player.findUnique({
      where: { socketId: clientId },
      include: { room: true },
    });
    if (!player || !player.roomId) {
      throw new Error(
        'getRoomInfo: Player not found or not associated with a room',
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('getRoomInfo: Room not found');
    }

    return room;
  }

  async getPlayersGuesses(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('getPlayersGuesses: Room not found');
    }

    const playerAnswers = await this.prisma.playerAnswer.findMany({
      where: { roomId: room.id, round: room.currentRound },
    });

    if (!playerAnswers) {
      throw new Error('getPlayersGuesses: Player answers not found');
    }

    return playerAnswers;
  }

  async getRankings(clientId: string) {
    // Coloca a sala em estado de finished e retorna, uma ultima vez, o objeto da sala com os players nele
    const player = await this.prisma.player.findUnique({
      where: { socketId: clientId },
      include: { room: true },
    });

    if (!player || !player.roomId) {
      throw new Error(
        'getRankings: Player not found or not associated with a room',
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { id: player.roomId },
      include: { players: true, messages: true },
    });

    if (!room) {
      throw new Error('getRankings: Room not found');
    }

    const players = await this.prisma.player.findMany({
      where: { roomId: room.id },
      orderBy: { score: 'desc' },
    });

    const updatedRoom = await this.prisma.room.update({
      where: { id: room.id },
      data: { status: RoomStatus.finished },
      include: { players: true, messages: true },
    });
    if (!updatedRoom) {
      throw new Error('getRankings: Updated room not found');
    }
    return updatedRoom;
  }

  async changeHost(currentHostId: string, newHostId: string) {
    const currentHost = await this.prisma.player.findUnique({
      where: { socketId: currentHostId },
    });
    if (!currentHost || !currentHost.roomId || !currentHost.isHost) {
      throw new Error(
        'changeHost: Current host not found or not associated with a room or not the Host',
      );
    }

    const newHost = await this.prisma.player.findUnique({
      where: { id: newHostId },
    });
    if (!newHost || !newHost.roomId) {
      throw new Error(
        'changeHost: New host not found or not associated with a room',
      );
    }

    await this.prisma.player.update({
      where: { id: currentHost.id },
      data: { isHost: false },
    });

    await this.prisma.player.update({
      where: { id: newHost.id },
      data: { isHost: true },
    });

    // Retorna a sala atualizada com o novo host
    const updatedRoom = await this.prisma.room.findUnique({
      where: { id: currentHost.roomId },
      include: { players: true, messages: true },
    });
    if (!updatedRoom) {
      throw new Error('changeHost: Updated room not found');
    }
    return updatedRoom;
  }

  async getUserName(socketId: string) {
    const player = await this.prisma.player.findUnique({
      where: { socketId },
    });
    if (!player) {
      throw new Error('getUserName: Player not found');
    }

    return player.name;
  }

  async getPlayersLocations() {
    // Coleta todas as localizacoes salvas no bd
    const localizations = await this.prisma.localization.findMany();
    if (!localizations) {
      throw new Error('getPlayersLocations: Localizations not found');
    }

    // Retorna os dados {longitude, latitude, cidade} de cada localizacao e a quantia de jogadores nessa mesma localizacao (long, lat)
    const playersLocations = localizations.reduce((acc: any, loc: any) => {
      const key = `${loc.longitude},${loc.latitude}`;
      if (!acc[key]) {
        acc[key] = {
          longitude: loc.longitude,
          latitude: loc.latitude,
          city: loc.city,
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {});
    const playersLocationsArray = Object.values(playersLocations).map(
      (loc: any) => {
        return {
          longitude: loc.longitude,
          latitude: loc.latitude,
          city: loc.city,
          count: loc.count,
        };
      },
    );

    // Retorna o array de localizacoes
    return playersLocationsArray;
  }
}
