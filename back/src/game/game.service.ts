import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}
}
