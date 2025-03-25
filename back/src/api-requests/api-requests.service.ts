import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config();

@Injectable()
export class ApiRequestsService {
  private clientId = process.env.CLIENT_ID;
  private clientSecret = process.env.CLIENT_SECRET;
  private geniusAccessToken = process.env.GENIUS_ACCESS_TOKEN;
  private musixmatchApiKey = process.env.MUSIXMATCH_API_KEY;

  private async getAccessToken(): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`,
          ).toString('base64')}`,
        },
      },
    );

    const data: unknown = result.data;

    // Verificação de tipo
    if (typeof data === 'object' && data !== null && 'access_token' in data) {
      return (data as AccessTokenResponse).access_token;
    } else {
      throw new Error('Invalid access token response');
    }
  }

  async searchTracks(track: string, artist: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const query = `track:${track} artist:${artist}`;
    const numberOfResults = 5;

    const result = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query,
      )}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data: any = result.data;

    const tracks = data.tracks.items
      .slice(0, numberOfResults)
      .map((item: any) => ({
        name: item.name,
        artist: item.artists.map((artist: any) => artist.name).join(', '),
        album: item.album.name,
        release_date: item.album.release_date,
        url: item.external_urls.spotify,
      }));

    return tracks;
  }

  async getLyrics(track: string, artist: string): Promise<string | undefined> {
    try {
      const query = `${track} ${artist}`;
      const result = await axios.get(
        `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${this.geniusAccessToken}`,
          },
        },
      );

      const data: any = result.data;

      if (data.response.hits.length > 0) {
        const songPath = data.response.hits[0].result.path;
        const lyricsPage = await axios.get(`https://genius.com${songPath}`);
        // return lyricsPage.data;
        const $ = cheerio.load(lyricsPage.data);
        let lyrics = '';

        $('.Lyrics__Container').each((i, elem) => {
          lyrics += $(elem).text() + '\n';
        });

        if (lyrics.trim()) {
          return lyrics.trim();
        } else {
          throw new Error('Lyrics not found');
        }
      } else {
        throw new Error('Song not found');
      }
    } catch (error) {
      console.error('Erro ao buscar a letra da música:', error);
      return undefined;
    }
  }

  async getLyrics2(track: string, artist: string): Promise<string | undefined> {
    try {
      const result = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.search?apikey=${this.musixmatchApiKey}&q_track=${track}&q_artist=${artist}`,
      );

      const commontrack_id =
        result.data.message.body.track_list[0].track.commontrack_id;

      const lyricsResult = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${this.musixmatchApiKey}&commontrack_id=${commontrack_id}`,
      );

      return lyricsResult.data.message.body.lyrics.lyrics_body;
    } catch (error) {
      console.error('Erro ao buscar a letra da música:', error);
      return undefined;
    }
  }
}

interface AccessTokenResponse {
  access_token: string;
}
