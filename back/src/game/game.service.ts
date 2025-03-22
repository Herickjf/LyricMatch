import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class GameService {
    // logica do banco de dados interagindo com o jogo
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.language.findMany();
    }
    
}
