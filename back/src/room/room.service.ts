import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(
    hostName: string,
    hostAvatar: string,
    roomPassword: string,
    maxPlayers: number,
    maxRounds: number,
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
}
