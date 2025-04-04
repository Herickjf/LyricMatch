import React, { useState, useEffect } from "react";

import { useSearchContext } from "../../../../utils/SearchContext";
import SongCard from "../../../../utils/SongCard";
import "../../../../css/game/desktop/rightbox_boxes/searchsong.css"
import { useSocket } from "../../../../utils/SocketContext";

const SearchSong: React.FC = () => {
    const [api_selected, setApiSelected] = useState<string>("LETRAS");
    const [song_name_selected, setSongNameSelected] = useState<string>("");
    const [artist_name_selected, setArtistNameSelected] = useState<string>("");
    const socket = useSocket();

    const { count } = useSearchContext();

    const makeChoice = () => {
        socket?.emit("submitAnswer", { musicApi: api_selected, track: song_name_selected, artist: artist_name_selected });
    }

    useEffect(() => {
        if (song_name_selected && artist_name_selected) {
            makeChoice();
        }
    }, [song_name_selected, artist_name_selected]);

    return (
        <div id="search_song_box">
            <div id="search_song_title">Which song?</div>
            
            <select id="search_song_select" value={api_selected} onChange={(e) => setApiSelected(e.target.value)}>
                <option value={"LETRAS"}>LetrasMus</option>
                <option value={"MUSIXMATCH"}>MusixMatch</option>
                <option value={"VAGALUME"}>Vagalume</option>
            </select>

            <div id="search_results_box">
                {
                    count?.map((result: any, index: number) => (
                        <SongCard 
                            album_cover={result.album_image} 
                            song_name={result.track_name} 
                            artist_name={result.artist} key={index}
                            func={() => {
                                setSongNameSelected(result.track_name);
                                setArtistNameSelected(result.artist);
                            }}
                            selected={song_name_selected == result.track_name && artist_name_selected == result.artist}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default SearchSong;