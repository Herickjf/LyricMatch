import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { MusicApi } from './music-api.enum';

dotenv.config();

@Injectable()
export class ApiRequestsService {
  async searchTracks_Deezer(track: string, artist: string): Promise<any> {
    const query = `${artist} ${track}`;

    try {
      const result = await axios.get(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`,
      );

      const data: any = result.data;

      const tracks = data.data.map((item: any) => ({
        id: item.id,
        track_name: item.title,
        artist: item.artist.name,
        album_image: item.album.cover_xl,
        preview: item.preview,
      }));

      return tracks;
    } catch (error) {
      throw new Error('Failed to search tracks on Deezer');
    }
  }

  async searchTrack_Deezzer_byId(id: string): Promise<any> {
    try {
      const result = await axios.get(`https://api.deezer.com/track/${id}`);
      const data: any = result.data;

      return {
        id: data.id,
        track_name: data.title,
        artist: data.artist.name,
        album_image: data.album.cover_xl,
        preview: data.preview,
      };
    } catch (error) {
      throw new Error('Failed to search track on Deezer');
    }
  }

  private async getLyrics_letrasmus(
    songName: string,
    artistName: string,
  ): Promise<string> {
    const url = `https://www.letras.mus.br/${artistName}/${songName}/`
      .replace(/ /g, '-')
      .toLowerCase();

    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const lyricsDiv = $('.lyric-original');

        if (lyricsDiv.length > 0) {
          // Itera sobre os parágrafos dentro de .lyric-original e processa os <br> como quebras de linha
          const lyrics = lyricsDiv
            .find('p')
            .map((_, p) => {
              const paragraph = $(p)
                .html() // Obtém o HTML do parágrafo
                ?.replace(/<br\s*\/?>/g, '\n') // Substitui <br> por \n
                .trim(); // Remove espaços extras
              return paragraph;
            })
            .get()
            .join('\n\n'); // Adiciona uma linha em branco entre os parágrafos

          return lyrics || 'Letra não encontrada na página.';
        } else {
          throw new Error('Letra não encontrada na página.');
          return 'Letra não encontrada na página.';
        }
      } else {
        return 'Erro ao acessar a página da música.';
      }
    } catch (error) {
      throw new Error(`Erro ao buscar a letra: ${error.message}`);
    }
  }

  private async getLyrics_musixmatch(
    songName: string,
    artistName: string,
  ): Promise<string> {
    // Formatações
    const formattedSong = songName.replace(/ /g, '-');
    const formattedArtist = artistName.replace(/ /g, '-');
  
    const url = `https://www.musixmatch.com/lyrics/${formattedArtist}/${formattedSong}`;
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    };
  
    try {
      const response = await axios.get(url, { headers });
  
      if (response.status !== 200) {
        return 'Erro ao acessar a página da música.';
      }
  
      const $ = cheerio.load(response.data);
  
      const lyrics = $('.css-175oi2r.r-zd98yo .css-175oi2r.r-18u37iz.r-1w6e6rj')
        .filter((_, el) => !$(el).hasClass('r-awgt0'))
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n');
  
      if (!lyrics) throw new Error('Letra não encontrada na página.');
  
      return lyrics;
    } catch (error) {
      throw new Error(`Erro ao buscar a letra: ${error.message}`);
    }
  }

  private async getLyrics_vagalume(
    track: string,
    artist: string,
  ): Promise<string | null> {
    track = track.toLowerCase().replace(/ /g, '-');
    artist = artist.toLowerCase().replace(/ /g, '-');
    const url = `https://www.vagalume.com.br/${artist}/${track}.html`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Seleciona o elemento com id "lyrics" e processa os <br> como quebras de linha
      const lyrics = $('#lyrics')
        .contents()
        .map((_, el) => ($(el).is('br') ? '\n' : $(el).text()))
        .get()
        .join('');

      return lyrics.trim(); // Remove espaços extras no início e no final
    } catch (error) {
      throw new Error('Erro ao buscar a letra da música');
    }
  }

  async getLyrics(track: string, artist: string, api_option: MusicApi) {
    switch (api_option) {
      case MusicApi.LETRAS:
        return this.getLyrics_letrasmus(track, artist);
      case MusicApi.MUSIXMATCH:
        return this.getLyrics_musixmatch(track, artist);
      case MusicApi.VAGALUME:
        return this.getLyrics_vagalume(track, artist);
      default:
        return { error_code: 400, message: 'Invalid API option' };
    }
  }
}
