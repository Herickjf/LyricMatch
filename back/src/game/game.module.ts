import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';
import { Logger } from '@nestjs/common';
import {
  RoomsCreatedCounterProvider,
  PlayersJoinedCounterProvider,
  MessagesSentCounterProvider,
  RoundsStartedCounterProvider,
  RoundsEndedCounterProvider,
  GameDurationHistogramProvider,
} from './metrics.providers';
import { MonitoringService } from 'src/monitoring/monitoring.module';

@Module({
  imports: [MonitoringService],
  providers: [
    GameService,
    GameGateway,
    PrismaService,
    ApiRequestsService,
    Logger,
    // Adicione os providers customizados:
    RoomsCreatedCounterProvider,
    PlayersJoinedCounterProvider,
    MessagesSentCounterProvider,
    RoundsStartedCounterProvider,
    RoundsEndedCounterProvider,
    GameDurationHistogramProvider,
  ],
  exports: [GameGateway],
})
export class GameModule {}
