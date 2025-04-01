import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Language } from '@prisma/client';
import { GameService } from './game.service';
import { MusicApi } from '../api-requests/music-api.enum';
import { Logger } from '@nestjs/common';
import { subscribe } from 'diagnostics_channel';

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
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly gameService: GameService,
    private readonly logger: Logger,
  ) {}
  @WebSocketServer()
  server: Server; // Instância do servidor WebSocket

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      if (room) this.server.to(room.code).emit('roomUpsert', room);
    } catch (error) {
      console.error('Erro na desconexão de client:', error);
    }
  }

  // Lida com a mensagem 'createRoom' enviada pelo cliente
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: { host: PlayerDto; room: RoomDto },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const r = await this.gameService.createRoom(
        client.id,
        data.host.name,
        data.host.avatar,
        data.room.password,
        data.room.maxPlayers,
        data.room.maxRounds,
        data.room.language,
      );
      if (!r) {
        client.emit('error', {
          message: 'Erro ao criar sala',
        });
        return;
      }
      await client.join(r.room.code); // Adiciona o cliente à sala
      this.server.to(r.room.code).emit('roomUpsert', { room: r.room }); // Emite um evento 'roomUpsert' para todos os clientes na sala com os dados da sala
      return {
        event: 'joinedRoom',
        data: r.room,
      };
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      client.emit('error', {
        message: 'Erro ao criar sala' + error,
      });
    }
  }

  // Lida com a mensagem 'joinRoom' enviada pelo cliente
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { code: string; player: PlayerDto; password: string },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const r = await this.gameService.joinRoom(
        client.id,
        data.code,
        data.player.name,
        data.player.avatar,
        data.password,
      );
      if (!r) {
        client.emit('error', {
          message: 'Erro ao entrar na sala',
        });
        return;
      }
      client.join(r.room.code); // Adiciona o cliente à sala
      this.server.to(r.room.code).emit('roomUpsert', r.room); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('error', {
        message: 'Erro ao entrar na sala' + error,
      });
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: { hostId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.startGame(data.hostId);
      if (!room) {
        client.emit('error', {
          message: 'Erro ao iniciar o jogo',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpsert', room);
      this.recursiveTimer(room.code, room.roundTimer);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
      client.emit('error', { message: 'Erro ao iniciar o jogo' });
    }
  }

  recursiveTimer(roomCode: string, time: number) {
    setTimeout(async () => {
      if (time > 0) {
        this.server.to(roomCode).emit('roundTimer', time);
        this.recursiveTimer(roomCode, time - 1);
      } else {
        try {
          const r = await this.gameService.endRound(roomCode);
          if (!r) {
            this.logger.error('Erro ao finalizar a rodada pelo timer');
            return;
          }
          this.server.to(roomCode).emit('roomUpsert', r.room);
          this.server.to(roomCode).emit('roomAnswers', r.answers);
        } catch (error) {
          this.logger.error('Erro ao finalizar a rodada pelo timer:', error);
          this.server.to(roomCode).emit('error', {
            message: 'Erro ao finalizar a rodada pelo timer',
          });
        }
      }
    }, 1000);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.sendMessage(client.id, data.message);
      if (!room) {
        client.emit('error', { message: 'Erro ao enviar mensagem' });
        return;
      }
      this.server.to(room.code).emit('roomUpsert', room);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      client.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody()
    data: {
      track: string;
      artist: string;
      musicApi: MusicApi;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.gameService.processAnswer(
        client.id,
        data.track,
        data.artist,
        data.musicApi,
      );
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      client.emit('error', { message: 'Erro ao enviar resposta' });
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      if (room) this.server.to(room.code).emit('roomUpsert', room);
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
      client.emit('error', { message: 'Erro ao sair da sala' });
    }
  }

  @SubscribeMessage('expelPlayer')
  async handleExpelPlayer(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.expelPlayer(client.id, data.playerId);
      if (!room) {
        client.emit('error', {
          message: 'Erro ao expulsar jogador',
        });
        return;
      }
      this.server.to(data.playerId).emit('expelled');
      this.server.to(room.code).emit('roomUpsert', room);
    } catch (error) {
      console.error('Erro ao expulsar jogador:', error);
      client.emit('error', {
        message: 'Erro ao expulsar jogador',
      });
    }
  }
  async handleNextRound(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.nextRound(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Erro ao avançar para a próxima rodada',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpsert', room);
    } catch (error) {
      console.error('Erro ao avançar para a próxima rodada:', error);
      client.emit('error', {
        message: 'Erro ao avançar para a próxima rodada',
      });
    }
  }
}
