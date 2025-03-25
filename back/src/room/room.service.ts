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
      const { nanoid } = await import('nanoid');
      const room = await this.prisma.room.create({
        data: {
          code: nanoid(6).toUpperCase(),
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
