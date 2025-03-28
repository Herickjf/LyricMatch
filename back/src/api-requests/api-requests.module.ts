import { Module } from '@nestjs/common';
import { ApiRequestsController } from './api-requests.controller';
import { ApiRequestsService } from './api-requests.service';

@Module({
  controllers: [ApiRequestsController],
  providers: [ApiRequestsService],
  exports: [ApiRequestsService],
})
export class ApiRequestsModule {}
