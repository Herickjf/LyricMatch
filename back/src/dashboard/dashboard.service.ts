import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { GameGateway } from 'src/game/game.gateway'; // Importe o GameGateway

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameGateway: GameGateway,
  ) {}

  async getServerData() {
    try {
      const [
        activeRoomCount,
        activePlayerCount,
        connectedWebSocketClientCount,
        averageClients,
      ] = await Promise.all([
        this.countActiveRooms(),
        this.countActivePlayers(),
        this.gameGateway.getConnectedClientsCount(),
        this.gameGateway.getAverageClients(),
      ]);

      return {
        activeRoomCount,
        activePlayerCount,
        connectedWebSocketClientCount,
        averageClients,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error fetching server data',
      );
    }
  }

  private async countActiveRooms(): Promise<number> {
    return this.prisma.room.count({
      where: {
        active: true,
      },
    });
  }

  private async countActivePlayers(): Promise<number> {
    return this.prisma.player.count({
      where: {
        roomId: {
          not: null,
        },
      },
    });
  }
}
