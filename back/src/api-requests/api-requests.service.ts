import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';

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

  private async searchTracks_Spotify(
    track: string,
    artist: string,
  ): Promise<any> {
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

  private async searchTracks_musixmatch(
    track: string,
    artist: string,
  ): Promise<any> {
    let limit = 5;

    const result = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.search?q_track=${track}&q_artist=${artist}&apikey=${this.musixmatchApiKey}&f_has_lyrics=1&page_size=${limit}`,
    );

    const data: any = result.data;

    const tracks = data.message.body.track_list.map((item: any) => ({
      track_name: item.track.track_name,
      artist_name: item.track.artist_name,
      album_image: item.track.album_coverart_100x100,
    }));

    return tracks;
  }

  async searchTracks_Vagalume(track: string, artist: string): Promise<any> {
    let limit = 5;
    const query = `${artist} ${track}`;

    const result = await axios.get(
      `https://api.vagalume.com.br/search.excerpt?q=${query}&apikey=${this.vagalumeApiKey}&limit=${limit}`,
    );

    const data: any = result.data;
    // const tracks = data.mus.map((item: any) => ({
    //   track_name: item.name,
    //   artist_name: item.band,
    //   album_image: item.pic_small,
    // }));

    return data;
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

  async searchTracks(
    track: string,
    artist: string,
    api_option: string | number,
  ): Promise<any> {
    switch (api_option) {
      case '1':
        return this.searchTracks_Spotify(track, artist);
      case '2': {
        const obj = await this.searchTracks_musixmatch(track, artist);
        obj['audio_preview'] = await this.getAudioPreview(track, artist);
        return obj;
      }
      case '3': {
        return await this.searchTracks_Vagalume(track, artist);
        // obj['audio_preview'] = await this.getAudioPreview(track, artist);
        // return obj;
      }
      default:
        return { error_code: 400, message: 'Invalid API option' };
    }
  }

  private async getLyrics_letrasmus(
    songName: string,
    artistName: string,
  ): Promise<string> {
    // Formatação do nome da música e do artista para se ajustar à URL do site
    const formattedSong = songName.replace(/ /g, '-').toLowerCase();
    const formattedArtist = artistName.replace(/ /g, '-').toLowerCase();

    const url = `https://www.letras.mus.br/${formattedArtist}/${formattedSong}/`;

    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const lyricsDiv = $('.lyric-original');

        if (lyricsDiv.length > 0) {
          return lyricsDiv.text().trim().replace(/\n+/g, '\n');
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

  // Substituir chamada da api por chamada direta ao site, usando scraping
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

  async getLyrics(track: string, artist: string, api_option: string | number) {
    switch (api_option) {
      case '1':
        return this.getLyrics_letrasmus(track, artist);
      case '2':
        return this.getLyrics_musixmatch(track, artist);
      case '3':
        return this.getLyrics_vagalume(track, artist);
      default:
        return { error_code: 400, message: 'Invalid API option' };
    }
  }
}

interface AccessTokenResponse {
  access_token: string;
}
