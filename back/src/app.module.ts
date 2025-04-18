import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';
import { PrismaModule } from './prisma-client/prisma-client.module';
import { GameModule } from './game/game.module';
import { ImageModule } from './image/image.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpMetricsInterceptor } from './common/interceptors/http-metrics.interceptor';

@Module({
  imports: [
    ApiRequestsModule,
    PrismaModule,
    GameModule,
    ImageModule,
    DashboardModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
})
export class AppModule {}
