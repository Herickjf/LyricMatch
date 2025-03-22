import { Controller, Get, Query } from '@nestjs/common';
import { ApiRequestsService } from './api-requests.service';

@Controller('api-requests')
export class ApiRequestsController {
  constructor(private readonly apiRequestsService: ApiRequestsService) {}

  @Get('search')
  async searchTracks(
    @Query('track') track: string,
    @Query('artist') artist: string
  ): Promise<any> {
    return this.apiRequestsService.searchTracks(track, artist);
  }

  @Get('lyrics')
  async getLyrics(
    @Query('track') track: string,
    @Query('artist') artist: string
  ): Promise<any> {
    return this.apiRequestsService.getLyrics(track, artist);
  }

  @Get('lyrics2')
  async getLyrics2(
    @Query('track') track: string,
    @Query('artist') artist: string
  ): Promise<any> {
    return this.apiRequestsService.getLyrics2(track, artist);
  }
}
