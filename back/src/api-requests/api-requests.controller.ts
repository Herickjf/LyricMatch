import { Controller, Get, Query } from '@nestjs/common';
import { ApiRequestsService } from './api-requests.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('api-requests')
export class ApiRequestsController {
  constructor(private readonly apiRequestsService: ApiRequestsService) {}

  @Get('search')
  @ApiQuery({
    name: 'api_option',
    description:
      'Escolha a API para buscar as letras: 1 para Spotify, 2 para Musixmatch, 3 para Vagalume',
    required: true,
    enum: ['1', '2', '3'], // Define as opções disponíveis
  })
  async searchTracks(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('api_option') api_option: string,
  ): Promise<any> {
    return this.apiRequestsService.searchTracks(track, artist, api_option);
  }

  @Get('lyrics')
  @ApiQuery({
    name: 'api_option',
    description:
      'Escolha a API para buscar as letras: 1 para Letras.mus, 2 para Musixmatch, 3 para Vagalume',
    required: true,
    enum: ['1', '2', '3'], // Define as opções disponíveis
  })
  async getLyrics(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('api_option') api_option: string,
  ): Promise<any> {
    return this.apiRequestsService.getLyrics(track, artist, api_option);
  }
}
