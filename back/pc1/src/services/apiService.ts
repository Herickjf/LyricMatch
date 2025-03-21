import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const geniusAccessToken = process.env.GENIUS_ACCESS_TOKEN!;

interface AccessTokenResponse {
  access_token: string;
}

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: params,
  });

  const data: unknown = await result.json();

  // Verificação de tipo
  if (typeof data === "object" && data !== null && "access_token" in data) {
    return (data as AccessTokenResponse).access_token;
  } else {
    throw new Error("Invalid access token response");
  }
}

export async function searchTracks(
  track: string,
  artist: string
): Promise<any> {
  const accessToken = await getAccessToken();
  const query = `track:${track} artist:${artist}`;
  const numberOfResults = 5;

  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data: any = await result.json();

  const tracks = data.tracks.items
    .slice(0, numberOfResults)
    .map((item: any) => ({
      name: item.name,
      artist: item.artists.map((artist: any) => artist.name).join(", "),
      album: item.album.name,
      release_date: item.album.release_date,
      url: item.external_urls.spotify,
    }));

  return tracks;
}

export async function getLyrics(
  track: string,
  artist: string
): Promise<string> {
  const query = `${track} ${artist}`;
  const result = await axios.get("https://api.genius.com/search", {
    headers: {
      Authorization: `Bearer ${geniusAccessToken}`,
    },
    params: {
      q: query,
    },
  });

  const hits = result.data.response.hits;
  if (hits.length > 0) {
    const songPath = hits[0].result.path;
    const lyricsPage = await axios.get(`https://genius.com${songPath}`);
    const lyrics = lyricsPage.data.match(/<div class="lyrics">([^<]+)<\/div>/);
    return lyrics ? lyrics[1] : "Lyrics not found";
  } else {
    throw new Error("Song not found");
  }
}
