import { Request, Response } from "express";
import { searchTracks } from "./apiService.js";

export const handleSearchTracks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const track = req.query.track as string;
    const artist = req.query.artist as string;

    if (!track || !artist) {
        return res
        .status(400)
        .json({ error: "Query parameters 'track' and 'artist' are required" });
    }

    const data = await searchTracks(track, artist);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tracks" });
  }
};
