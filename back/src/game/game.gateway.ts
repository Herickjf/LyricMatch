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

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    // Aqui você pode implementar a lógica para remover o usuário de todas as salas
    // caso esteja mapeando client.id para usernames/salas
  }

  // Lida com a mensagem 'createRoom' enviada pelo cliente
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: { host: PlayerDto; room: RoomDto },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const r = await this.gameService.createRoom(
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
      this.server.to(r.room.code).emit('roomUpdate', { room: r.room }); // Emite um evento 'roomUpdate' para todos os clientes na sala com os dados da sala
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
      this.server.to(r.room.code).emit('roomUpdate', r.room); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('joinError', {
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
      this.server.to(room.code).emit('roomUpdate', room);
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
          this.server.to(roomCode).emit('roomUpdate', r.room);
        } catch (error) {
          this.logger.error('Erro ao finalizar a rodada pelo timer:', error);
          this.server.to(roomCode).emit('error', {
            message: 'Erro ao finalizar a rodada pelo timer',
          });
        }
      }
    }, 1000);
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
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      client.emit('error', { message: 'Erro ao enviar resposta' });
    }
  }

  // @SubscribeMessage('endRound')
  // async handleEndRound(
  //   @MessageBody() data: { roomCode: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   try {
  //     const r = await this.gameService.endRound(data.roomCode);
  //     if (!r) {
  //       client.emit('error', {
  //         message: 'Erro ao finalizar a rodada',
  //       });
  //       return;
  //     }
  //     this.server.to(r.room.code).emit('roomUpdate', r.room);
  //   } catch (error) {
  //     console.error('Erro ao finalizar a rodada:', error);
  //     client.emit('error', { message: 'Erro ao finalizar a rodada' });
  //   }
  // }

  @SubscribeMessage('nextRound')
  async handleNextRound(
    @MessageBody() data: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.nextRound(data.roomCode);
      if (!room) {
        client.emit('error', {
          message: 'Erro ao avançar para a próxima rodada',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao avançar para a próxima rodada:', error);
      client.emit('error', {
        message: 'Erro ao avançar para a próxima rodada',
      });
    }
  }
}
