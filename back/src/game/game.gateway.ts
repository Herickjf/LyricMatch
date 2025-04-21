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
import { Logger } from '@nestjs/common';
import axios from 'axios'; // Biblioteca para fazer requisições HTTP

// Biblioteca para pegar o endereço IPv6 do cliente a partir do socket
import * as os from 'os';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';

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

    @InjectMetric('ws_connections_total')
    private readonly wsConn: Gauge<string>,
    @InjectMetric('ws_messages_total')
    private readonly wsMsgs: Counter<string>,
  ) {}
  @WebSocketServer()
  server: Server; // Instância do servidor WebSocket

  async getLocalIpv6() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      const networkInterface = interfaces[interfaceName];
      if (networkInterface) {
        for (const net of networkInterface) {
          if (net.family === 'IPv6' && !net.internal) {
            return net.address; // Retorna o endereço IPv6
          }
        }
      }
    }
    return null; // Retorna null se não encontrar um endereço IPv6
  }

  handleConnection(client: Socket) {
    this.wsConn.inc(); // Incrementa o contador de conexões WebSocket
    this.requestNotification('SOCKET', client.id + ' connected'); // Envia uma notificação de conexão para todos os clientes conectados
  }

  async handleDisconnect(client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      this.requestNotification('SOCKET', client.id + ' disconnected'); // Envia uma notificação de desconexão para todos os clientes conectados
      client.emit('disconnected');
      this.wsConn.dec(); // Incrementa o contador de conexões WebSocket
      if (!room) {
        return; // Se o cliente não estava em uma sala, não faz nada
      }
      if (room) this.server.to(room.code).emit('roomUpdate', room);
    } catch (error) {
      console.error('Erro na desconexão de client:', client.id, error);
    }
  }

  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.wsMsgs.inc(1); // Incrementa o contador de mensagens WebSocket
      // Aqui você pode adicionar lógica adicional para lidar com mensagens genéricas, se necessário
    } catch (error) {
      this.logger.error('Erro ao processar mensagem:', error);
    }
  }

  // Lida com a mensagem 'createRoom' enviada pelo cliente
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: { host: PlayerDto; room: RoomDto },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      // Obtem o endereco IPv6 do cliente:
      let clientIp: string | null = client.handshake.address; // Endereço IP do cliente

      // Se for ipv6:
      if (clientIp.includes(':')) {
        // Se for o endereço local, pega o ipv6 local:
        // Se for o ipv6 normal, não faz nada
        if (clientIp === '::1') {
          clientIp = (await this.getLocalIpv6()) || null;
        }

        // Realiza o fetch para obter as informações do cliente
        const response = await axios.get(`https://ipinfo.io/${clientIp}/json`);
        const data = response.data; // Dados retornados pela API
        if ('country' in data) {
          clientIp = data;
        } else {
          clientIp = null; // Se não for ipv6, não faz nada
        }
      } else {
        clientIp = null; // Se for ipv4, não faz nada
      }

      const r = await this.gameService.createRoom(
        client.id,
        data.host.name,
        data.host.avatar,
        data.room.password,
        data.room.maxPlayers,
        data.room.maxRounds,
        data.room.language,
        clientIp, // Passa o endereço IPv6 do cliente
      );
      if (!r) {
        client.emit('error', {
          message: 'Erro ao criar sala',
        });
        return;
      }
      await client.join(r.room.code); // Adiciona o cliente à sala
      this.server.to(r.room.code).emit('roomUpdate', r.room); // Emite um evento 'roomUpdate' para todos os clientes na sala com os dados da sala
      this.requestNotification(
        'SOCKET',
        'created the room ' + r.room.code,
        client.id,
      );
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
      // Obtem o endereco IPv6 do cliente:
      let clientIp: string | null = client.handshake.address; // Endereço IP do cliente

      // Se for ipv6:
      if (clientIp.includes(':')) {
        // Se for o endereço local, pega o ipv6 local:
        // Se for o ipv6 normal, não faz nada
        if (clientIp === '::1') {
          clientIp = (await this.getLocalIpv6()) || null;
        }

        // Realiza o fetch para obter as informações do cliente
        const response = await axios.get(`https://ipinfo.io/${clientIp}/json`);
        const data = response.data; // Dados retornados pela API
        if ('country' in data) {
          // Confirma se a busca foi bem sucedida
          clientIp = data;
        } else {
          clientIp = null; // Se não for ipv6, não faz nada
        }
      } else {
        clientIp = null; // Se for ipv4, não faz nada
      }

      const r = await this.gameService.joinRoom(
        client.id,
        data.code,
        data.player.name,
        data.player.avatar,
        data.password,
        clientIp, // Passa o endereço IPv6 do cliente
      );
      if (!r) {
        client.emit('error', {
          message: 'error joining room, certify the code and password',
        });
        return;
      }
      client.join(r.room.code); // Adiciona o cliente à sala
      this.server.to(r.room.code).emit('roomUpdate', r.room); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
      this.requestNotification(
        'SOCKET',
        'joined the room ' + r.room.code,
        client.id,
      );
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
      this.requestNotification(
        'SOCKET',
        'started the game in the room ' + room.code,
        client.id,
      );
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
      this.requestNotification(
        'SOCKET',
        'sent a message in the room ' + room.code,
        client.id,
      );
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
      music_id: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.gameService.processAnswer(
        client.id,
        data.track,
        data.artist,
        data.music_id,
      );
      this.requestNotification(
        'SOCKET',
        'made an attempt in a round',
        client.id,
      );
    } catch (error) {
      console.error('Erro ao enviar resposta de busca de musica');
      client.emit('error', {
        message: 'This song was not found, please try another one',
      });
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(@ConnectedSocket() client: Socket) {
    try {
      const room = await this.gameService.exitRoom(client.id);
      if (room) {
        this.server.to(room.code).emit('roomUpdate', room);
        this.requestNotification(
          'SOCKET',
          'left the room ' + room?.code,
          client.id,
        );
      }
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
      this.requestNotification(
        'SOCKET',
        'expelled a player from the room ' + room.code,
        client.id,
      );
      this.requestNotification(
        'SOCKET',
        'was expelled from the room ' + room.code,
        data.playerId,
      );
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
      this.requestNotification(
        'SOCKET',
        'changed the host of the room ' + room.code,
        client.id,
      );
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
      this.requestNotification(
        'SOCKET',
        'a new round started in the room ' + room.code,
      );
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
      this.requestNotification(
        'SOCKET',
        'requested information from room ' + room.code,
        client.id,
      );
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
      this.requestNotification(
        'SOCKET',
        'requested rankings from room ' + room.code,
        client.id,
      );
      this.requestNotification('SOCKET', 'a match ended in room ' + room.code);
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
      this.requestNotification(
        'SOCKET',
        'reseted the room ' + room.code,
        client.id,
      );
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

  async requestNotification(type: string, text: string, user?: string) {
    try {
      let user_name: string = ''; // Se o usuario não for passado, não faz nada

      if (user) {
        user_name = (await this.gameService.getUserName(user)) + ' '; // Pega o nome do usuario
      }

      const notification = {
        type: type,
        text: user_name + text,
      };
      this.server.emit('requests', notification); // Envia a notificação para todos os clientes conectados, que estejam ouvindo o evento 'requests'
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('get_players_locations')
  async getPlayersLocations(@ConnectedSocket() client: Socket) {
    try {
      const locations = await this.gameService.getPlayersLocations();
      if (!locations) {
        client.emit('error', { message: 'Error getting players locations' });
        return;
      }
      client.emit('players_locations', locations); // Envia as localizações dos jogadores para o cliente
    } catch (error) {
      console.error('Erro ao obter localizações dos jogadores:', error);
      client.emit('error', { message: 'Error getting players locations' });
    }
  }
}
