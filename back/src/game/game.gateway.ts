import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Language } from '@prisma/client';
import { GameService } from './game.service';
import { MusicApi } from '../api-requests/music-api.enum';

interface PlayerDto {
  name: string;
  avatar: string;
}

interface RoomDto {
  password: string;
  maxPlayers: number;
  maxRounds: number;
  language: Language;
}

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server; // Instância do servidor WebSocket

  constructor(private readonly gameService: GameService) {}

  // Lida com a mensagem 'createRoom' enviada pelo cliente
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: { host: PlayerDto; room: RoomDto },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const { code, host } = await this.gameService.createRoom(
        data.host.name,
        data.host.avatar,
        data.room.password,
        data.room.maxPlayers,
        data.room.maxRounds,
        data.room.language,
      );
      client.join(code); // Adiciona o cliente à sala
      client.emit('roomCreated', { code, host }); // Emite um evento 'roomCreated' para o cliente com o código da sala e o host
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      client.emit('createError', { message: 'Erro ao criar sala' + error.message });
    }
  }

  // Lida com a mensagem 'joinRoom' enviada pelo cliente
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { code: string; player: PlayerDto; password: string },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const { room, user } = await this.gameService.joinRoom(
        data.code,
        data.player.name,
        data.player.avatar,
        data.password,
      );
      client.join(room.code); // Adiciona o cliente à sala
      this.server.to(room.code).emit('userJoined', { name: user.name }); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('joinError', { message: 'Erro ao entrar na sala' + error.message });
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const gameState = await this.gameService.startGame(data.roomCode);
      this.server.to(data.roomCode).emit('gameStarted', gameState);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
      client.emit('error', { message: 'Erro ao iniciar o jogo' });
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody()
    data: {
      roomCode: string;
      playerId: string;
      track: string;
      artist: string;
      musicApi: MusicApi;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.gameService.processAnswer(
        data.roomCode,
        data.playerId,
        data.track,
        data.artist,
        data.musicApi,
      );

      client.emit('answerFeedback', {
        isCorrect: result.isCorrect,
        message: result.isCorrect ? 'Resposta correta!' : 'Resposta incorreta!',
      });
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      client.emit('error', { message: 'Erro ao enviar resposta' });
    }
  }

  @SubscribeMessage('endRound')
  async handleEndRound(
    @MessageBody() data: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roundResults = await this.gameService.endRound(data.roomCode);
      this.server.to(data.roomCode).emit('roundEnded', roundResults);
    } catch (error) {
      console.error('Erro ao finalizar a rodada:', error);
      client.emit('error', { message: 'Erro ao finalizar a rodada' });
    }
  }

  @SubscribeMessage('nextRound')
  async handleNextRound(
    @MessageBody() data: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const gameState = await this.gameService.nextRound(data.roomCode);
      if (gameState.gameOver) {
        this.server.to(data.roomCode).emit('gameOver', gameState);
      } else {
        this.server.to(data.roomCode).emit('roundUpdated', gameState);
      }
    } catch (error) {
      console.error('Erro ao avançar para a próxima rodada:', error);
      client.emit('error', {
        message: 'Erro ao avançar para a próxima rodada',
      });
    }
  }
}
