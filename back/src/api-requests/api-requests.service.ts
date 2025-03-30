import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { MusicApi } from './music-api.enum';

dotenv.config();

@Injectable()
export class ApiRequestsService {
  async searchTracks_Deezer(
    track: string,
    artist: string
  ): Promise<any> {
    const query = `${artist} ${track}`;

    try {
      const result = await axios.get(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`,
      );

      const data: any = result.data;

      const tracks = data.data.map((item: any) => ({
        track_name: item.title,
        artist: item.artist.name,
        album_image: item.album.cover_xl,
        preview: item.preview,
      }));

      return tracks;
    } catch (error) {
      console.error('Error searching tracks on Deezer:', error.message);
      throw new Error('Failed to search tracks on Deezer');
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
          return 'Letra não encontrada na página.';
        }
      } else {
        return 'Erro ao acessar a página da música.';
      }
    } catch (error) {
      return `Erro ao buscar a letra: ${error}`;
    }
  }

  private async getLyrics_musixmatch(
    songName: string,
    artistName: string,
  ): Promise<string> {
    // Formatação do nome da música e do artista para se ajustar à URL do site
    songName = songName.replace(' ', '-');
    artistName = artistName.replace(' ', '-');

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    };

    // Construção da URL da página da música no Musixmatch
    const url = `https://www.musixmatch.com/lyrics/${artistName}/${songName}`;

    try {
      // Realizando a requisição HTTP
      const response = await axios.get(url, { headers });

      // Verificando se a requisição foi bem-sucedida (status 200)
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        // A letra geralmente está dentro de divs com as classes específicas
        const lyricsSpans = $('.css-175oi2r.r-18u37iz.r-1w6e6rj');
        if (lyricsSpans.length > 0) {
          const lyrics = lyricsSpans
            .map((index, span) => $(span).text().trim())
            .get()
            .join('\n');
          return lyrics;
        } else {
          return 'Letra não encontrada na página.';
        }
      } else {
        return 'Erro ao acessar a página da música.';
      }
    } catch (error) {
      return `Erro ao buscar a letra: ${error.message}`;
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
      console.error('Erro ao buscar a letra da música:', error);
      return null;
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
