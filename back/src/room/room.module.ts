import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Module({
  providers: [RoomService, RoomGateway, PrismaService],
})
export class RoomModule {}
