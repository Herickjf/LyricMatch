import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-client.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
