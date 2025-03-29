import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';
import { PrismaModule } from './prisma-client/prisma-client.module';
import { GameModule } from './game/game.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [ApiRequestsModule, PrismaModule, GameModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
