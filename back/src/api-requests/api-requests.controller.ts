import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiRequestsService } from './api-requests.service';
import { ApiQuery } from '@nestjs/swagger';
import { MusicApi } from '@prisma/client';

@Controller('api-requests')
export class ApiRequestsController {
  constructor(private readonly apiRequestsService: ApiRequestsService) {}

  @Get('search')
  async searchTracks(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('limit') limit: string,
  ): Promise<any> {
    return this.apiRequestsService.searchTracks_Deezer(track, artist, +limit);
  }

  @Get('lyrics')
  @ApiQuery({
    name: 'api_option',
    description:
      'Escolha a API para buscar as letras: LETRAS, MUSIXMATCH ou VAGALUME',
    required: true,
    enum: MusicApi,
  })
  async getLyrics(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('api_option') api_option: MusicApi,
  ): Promise<any> {
    if (!Object.values(MusicApi).includes(api_option)) {
      throw new BadRequestException('Invalid API option');
    }

    return this.apiRequestsService.getLyrics(track, artist, api_option);
  }
}
