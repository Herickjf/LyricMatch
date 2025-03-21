import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

interface AccessTokenResponse {
  access_token: string;
}

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const result = await axios.post("https://accounts.spotify.com/api/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  });

  const data: unknown = result.data;

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

  const result = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data: any = result.data;

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
