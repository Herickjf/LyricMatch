import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiRequestsService } from './api-requests.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('api-requests')
export class ApiRequestsController {
  constructor(private readonly apiRequestsService: ApiRequestsService) {}

  @Get('search')
  async searchTracks(
    @Query('track') track: string,
    @Query('artist') artist: string,
  ): Promise<any> {
    return this.apiRequestsService.searchTracks_Deezer(track, artist);
  }

  @Get('searchById')
  async searchTrackById(@Query('id') id: string): Promise<any> {
    return this.apiRequestsService.searchTrack_Deezzer_byId(id);
  }

  @Get('lyrics')
  @ApiQuery({ name: 'track', required: true })
  @ApiQuery({ name: 'artist', required: true })
  async getLyrics(
    @Query('track') track: string,
    @Query('artist') artist: string,
  ): Promise<any> {
    return this.apiRequestsService.getLyrics(track, artist);
  }
}
