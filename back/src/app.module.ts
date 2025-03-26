import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';
import { PrismaModule } from './prisma-client/prisma-client.module';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [ApiRequestsModule, PrismaModule, RoomModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
