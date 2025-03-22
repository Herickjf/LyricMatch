import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';
import { PrismaModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [ApiRequestsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
