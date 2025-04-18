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
      ] = await Promise.all([
        this.countActiveRooms(),
        this.countActivePlayers(),
        this.gameGateway.getConnectedClientsCount(),
      ]);

      return {
        activeRoomCount,
        activePlayerCount,
        connectedWebSocketClientCount,
        averageClients: activePlayerCount / activeRoomCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error fetching server data',
      );
    }
  }

  private async countActiveRooms(): Promise<number> {
    return this.prisma.room.count();
  }

  private async countActivePlayers(): Promise<number> {
    return this.prisma.player.count();
  }
}
