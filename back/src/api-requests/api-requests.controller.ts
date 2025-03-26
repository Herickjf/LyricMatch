import { Controller, Get, Query } from '@nestjs/common';
import { ApiRequestsService } from './api-requests.service';

@Controller('api-requests')
export class ApiRequestsController {
  constructor(private readonly apiRequestsService: ApiRequestsService) {}

  @Get('search')
  async searchTracks(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('api_option') api_option: string,
  ): Promise<any> {
    return this.apiRequestsService.searchTracks(track, artist, api_option);
  }

  @Get('lyrics')
  async getLyrics(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('api_option') api_option: string,
  ): Promise<any> {
    return this.apiRequestsService.getLyrics(track, artist, api_option);
  }

}
