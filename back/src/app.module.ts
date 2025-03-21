import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiRequestsModule } from './api-requests/api-requests.module';

@Module({
  imports: [ApiRequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
