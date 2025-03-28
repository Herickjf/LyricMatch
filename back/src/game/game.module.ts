import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Module({
  providers: [GameService, GameGateway, PrismaService, ApiRequestsService],
})
export class GameModule {}
