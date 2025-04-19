// src/game/game.module.ts
import { Module, Logger } from '@nestjs/common';
import { MonitoringModule } from 'src/monitoring/monitoring.module';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';

@Module({
  imports: [MonitoringModule],
  providers: [
    GameService,
    GameGateway,
    PrismaService,
    ApiRequestsService,
    Logger,
  ],
  exports: [
    // aqui você exporta o que quer disponibilizar pra fora
    GameGateway,
    GameService,
  ],
})
export class GameModule {}
