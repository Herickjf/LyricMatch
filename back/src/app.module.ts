import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';
import { PrismaModule } from './prisma-client/prisma-client.module';
import { GameModule } from './game/game.module';
import { ImageModule } from './image/image.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocalizationModule } from './localization/localization.module';

@Module({
  imports: [
    ApiRequestsModule,
    PrismaModule,
    GameModule,
    ImageModule,
    DashboardModule,
    LocalizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
