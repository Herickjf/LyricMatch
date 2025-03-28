import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { ApiRequestsService } from 'src/api-requests/api-requests.service';

@Module({
  providers: [RoomService, RoomGateway, PrismaService, ApiRequestsService],
})
export class RoomModule {}
