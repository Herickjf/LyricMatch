import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

dotenv.config();

@Injectable()
export class ApiRequestsService {
  private clientId = process.env.CLIENT_ID;
  private clientSecret = process.env.CLIENT_SECRET;
  private musixmatchApiKey = process.env.MUSIXMATCH_API_KEY;
  private vagalumeApiKey = process.env.VAGALUME_API_KEY;

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

  private async searchTracks_Spotify(track: string, artist: string): Promise<any> {
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
        track_name: item.name,
        artist_name: item.artists[0].name,
        album_image: item.album.images[0].url,
        audio_preview: item.preview_url,
      }));

    return tracks;
  }

  private async searchTracks_musixmatch(track: string, artist: string): Promise<any> {
    let limit = 5;

    const result = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.search?q_track=${track}&q_artist=${artist}&apikey=${this.musixmatchApiKey}&f_has_lyrics=1&page_size=${limit}`
    );

    const data: any = result.data;

    const tracks = data.message.body.track_list.map((item: any) => ({
      track_name: item.track.track_name,
      artist_name: item.track.artist_name,
      album_image: item.track.album_coverart_100x100
    }));

    return tracks;
  }

  async searchTracks_Vagalume(track: string, artist: string): Promise<any> {
    let limit = 5;

    const result = await axios.get(
      `https://api.vagalume.com.br/search.php?art=${artist}&mus=${track}&apikey=${this.vagalumeApiKey}`
    );

    const data: any = result.data;
    const tracks = data.mus.map((item: any) => ({
      track_name: item.name,
      artist_name: item.band,
      album_image: item.pic_small
    }));

    return tracks;
    
  }

  async getAudioPreview(track: string, artist: string): Promise<string | null> {
    const accessToken = await this.getAccessToken();
    const query = `track:${track} artist:${artist}`;

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

    if (data.tracks.items.length === 0) {
      return null;
    }

    return data.tracks.items[0].preview_url;
  }

  async searchTracks(track: string, artist: string, api_option: string|number): Promise<any> {
    if(api_option == '1'){
      return this.searchTracks_Spotify(track, artist);
    } else if(api_option == '2'){
      let obj = await this.searchTracks_musixmatch(track, artist);
      obj["audio_preview"] = await this.getAudioPreview(track, artist);
      return obj;
    } else if(api_option == '3'){
      return this.searchTracks_Vagalume(track, artist);
    }

    return {error_code: 400, message: "Invalid API option"};
  }


  private async getLyrics_letrasmus(track: string, artist: string): Promise<string | undefined> {
    
    // Primeiro, formata os parâmetros para a URL
    track = track.toLowerCase().replace(/ /g, '-');
    artist = artist.toLowerCase().replace(/ /g, '-');
    const url = `https://www.letras.mus.br/${artist}/${track}/`;

    try {
      // Faz a requisição para a página da letra
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extrai a letra da música
      const lyrics = $('.lyric-original div').text();
      return lyrics;
    } catch (error) {
      console.error('Erro ao buscar a letra da música:', error);
      return undefined;
    }

  }

  // Substituir chamada da api por chamada direta ao site, usando scraping
  private async getLyrics_musixmatch(track: string, artist: string): Promise<string | undefined> {
    track = track.replace(/ /g, '-');
    artist = artist.replace(/ /g, '-');
    const url = `https://www.musixmatch.com/lyrics/${artist}/${track}`;

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Aguarda o seletor correto carregar
      await page.waitForSelector('.css-175oi2r .r-18u37iz .r-1w6e6rj');

      // Captura a letra da música
      const lyrics = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.css-175oi2r .r-18u37iz .r-1w6e6rj'))
          .map(el => el.textContent?.trim())
          .join('\n');
      });

      await browser.close();
      return lyrics || undefined;
    } catch (error) {
      console.error('Erro ao buscar a letra no Musixmatch:', error.message);
      return undefined;
    }
  }

  private async getLyrics_vagalume(track: string, artist: string): Promise<string | null> {
    track = track.toLowerCase().replace(/ /g, '-');
    artist = artist.toLowerCase().replace(/ /g, '-');
    const url = `https://www.vagalume.com.br/${artist}/${track}.html`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const lyrics = $('#lyrics').text();
      return lyrics;
    } catch (error) {
      console.error('Erro ao buscar a letra da música:', error);
      return null;
    }

  }

  async getLyrics(track: string, artist: string, api_option:string|number){
    if(api_option == '1'){
      return this.getLyrics_letrasmus(track, artist);
    } else if(api_option == '2'){
      return this.getLyrics_musixmatch(track, artist);
    } else if(api_option == '3'){
      return this.getLyrics_vagalume(track, artist);
    }

    return {error_code: 400, message: "Invalid API option"};
  }
}

interface AccessTokenResponse {
  access_token: string;
}
