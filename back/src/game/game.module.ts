import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Module({
  providers: [GameService, PrismaService],
  controllers: [GameController],
})
export class GameModule {}
