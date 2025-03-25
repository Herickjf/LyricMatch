import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

interface PlayerDto {
  name: string;
  avatar: string;
}

interface RoomDto {
  password: string;
  maxPlayers: number;
  maxRounds: number;
}

@WebSocketGateway({ cors: true })
export class RoomGateway {
  @WebSocketServer()
  server: Server; // Instância do servidor WebSocket

  constructor(private readonly roomService: RoomService) {}

  // Lida com a mensagem 'createRoom' enviada pelo cliente
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: { host: PlayerDto; room: RoomDto },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const { code, host } = await this.roomService.createRoom(
        data.host.name,
        data.host.avatar,
        data.room.password,
        data.room.maxPlayers,
        data.room.maxRounds,
      );
      client.join(code); // Adiciona o cliente à sala
      client.emit('roomCreated', { code, host }); // Emite um evento 'roomCreated' para o cliente com o código da sala e o host
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      client.emit('error', { message: 'Erro ao criar sala' });
    }
  }

  // Lida com a mensagem 'joinRoom' enviada pelo cliente
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { code: string; player: PlayerDto; password: string },
    @ConnectedSocket() client: Socket, // Socket do cliente conectado
  ) {
    try {
      const { room, user } = await this.roomService.joinRoom(
        data.code,
        data.player.name,
        data.player.avatar,
        data.password,
      );
      client.join(room.code); // Adiciona o cliente à sala
      this.server.to(room.code).emit('userJoined', { name: user.name }); // Emite um evento 'userJoined' para todos os clientes na sala com o nome do jogador
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('error', { message: 'Erro ao entrar na sala' });
    }
  }
}
