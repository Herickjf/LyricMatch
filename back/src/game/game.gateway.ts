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

  async handleDisconnect(client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      if (!room) {
        return; // Se o cliente não estava em uma sala, não faz nada
      }
      if (room) this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro na desconexão de client:', client.id, error);
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
      this.server.to(r.room.code).emit('roomUpdate', r.room); // Emite um evento 'roomUpdate' para todos os clientes na sala com os dados da sala
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
          message: 'error joining room, certify the code and password',
        });
        return;
      }
      client.join(r.room.code); // Adiciona o cliente à sala
      this.server.to(r.room.code).emit('roomUpdate', r.room); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('error', {
        message: 'error joining room, certify the code and password',
      });
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.startGame(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Erro ao iniciar o jogo',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpdate', room);
      this.recursiveTimer(room.code, room.roundTimer, client.id);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
      client.emit('error', { message: 'error starting game' });
    }
  }

  recursiveTimer(roomCode: string, time: number, clientId: string) {
    setTimeout(async () => {
      if (time > 0) {
        this.server.to(roomCode).emit('roundTimer', time);
        this.recursiveTimer(roomCode, time - 1, clientId);
      } else {
        try {
          const r = await this.gameService.endRound(clientId);
          if (!r) {
            this.logger.error('Erro ao finalizar a rodada pelo timer');
            return;
          }
          this.server.to(roomCode).emit('roomUpdate', r.room);
          this.server.to(roomCode).emit('roomAnswers', r.answers);
        } catch (error) {
          this.logger.error('Erro ao finalizar a rodada pelo timer:', error);
          this.server.to(roomCode).emit('error', {
            message: 'error finalizing round',
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
        client.emit('error', { message: 'error sending message' });
        return;
      }
      this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      client.emit('error', { message: 'error sending message' });
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody()
    data: {
      track: string;
      artist: string;
      musicApi: MusicApi;
      music_id: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.gameService.processAnswer(
        client.id,
        data.track,
        data.artist,
        data.musicApi,
        data.music_id,
      );
    } catch (error) {
      console.error('Erro ao enviar resposta de busca de musica');
      client.emit('error', { message: "This song was not found in this source, try another one"});
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      if (room) this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
      client.emit('error', { message: 'error leaving the room' });
    }
  }

  @SubscribeMessage('expelPlayer')
  async handleExpelPlayer(
    @MessageBody() data: { playerId: string; socketId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.expelPlayer(client.id, data.playerId);
      if (!room) {
        client.emit('error', {
          message: 'Error expelling player',
        });
        return;
      }
      this.server.to(data.socketId).emit('expelled');
      this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao expulsar jogador:', error);
      client.emit('error', {
        message: 'Error expelling player',
      });
    }
  }

  @SubscribeMessage('changeHost')
  async handleChangeHost(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.gameService.changeHost(client.id, data.playerId);
      if (!room) {
        client.emit('error', {
          message: 'Error changing host',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao mudar o host:', error);
      client.emit('error', {
        message: 'Error changing host',
      });
    }
  }

  @SubscribeMessage('nextRound')
  async handleNextRound(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.nextRound(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Error advancing to the next round',
        });
        return;
      }
      this.server.to(room.code).emit('roomUpdate', room);
      this.recursiveTimer(room.code, room.roundTimer, client.id);
    } catch (error) {
      console.error('Erro ao avançar para a próxima rodada:', error);
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('getRoomInfo')
  async handleGetRoomInfo(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.getRoomInfo(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Error getting room information',
        });
        return;
      }

      const playersguesses = await this.gameService.getPlayersGuesses(
        room.code,
      );
      if (!playersguesses) {
        client.emit('error', {
          message: 'Error getting players guesses',
        });
        return;
      }

      client.emit('roomUpdate', room);
      client.emit('roomAnswers', playersguesses);
    } catch (error) {
      console.error('Erro ao obter informações da sala:', error);
      client.emit('error', {
        message: 'Error getting room information',
      });
    }
  }

  @SubscribeMessage('getRankings')
  async handleGetRankings(@ConnectedSocket() client: Socket) {
    // Coloca a sala em estado de finished e retorna, uma ultima vez, o objeto da sala com os players nele
    try {
      const room = await this.gameService.getRankings(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Error getting room information',
        });
        return;
      }
      client.emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao obter informações da sala:', error);
      client.emit('error', {
        message: 'Error getting room information',
      });
    }
  }

  @SubscribeMessage('resetRoom')
  async handleResetRoom(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.resetRoom(client.id);
      if (!room) {
        client.emit('error', {
          message: 'Error resetting room',
        });
        return;
      }
      client.emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro ao obter informações da sala:', error);
      client.emit('error', {
        message: 'Error resetting room',
      });
    }
  }

  getConnectedClientsCount(): number {
    return this.server.sockets.sockets.size; // Retorna o número de clientes conectados
  }

  private connectedClients: number[] = []; // Array para armazenar o número de clientes conectados em cada segundo
  private intervalId: NodeJS.Timeout;

  startTrackingClients() {
    this.intervalId = setInterval(() => {
      const count = this.server.sockets.sockets.size;
      this.connectedClients.push(count);

      // Limita o tamanho do array para evitar crescimento infinito
      if (this.connectedClients.length > 60) {
        this.connectedClients.shift(); // Remove o valor mais antigo
      }
    }, 1000); // Executa a cada segundo
  }

  stopTrackingClients() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getAverageClients(): number {
    if (this.connectedClients.length === 0) {
      return 0; // Evita divisão por zero
    }
    const sum = this.connectedClients.reduce((a, b) => a + b, 0);
    return sum / this.connectedClients.length;
  }
}
