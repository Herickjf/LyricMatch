import React, { useState, useEffect } from "react";

import { useSearchContext } from "../../../../utils/SearchContext";
import SongCard from "../../../../utils/SongCard";
import "../../../../css/game/desktop/rightbox_boxes/searchsong.css"
import { useSocket } from "../../../../utils/SocketContext";

const SearchSong: React.FC = () => {
    const [song_name_selected, setSongNameSelected] = useState<string>("");
    const [artist_name_selected, setArtistNameSelected] = useState<string>("");
    const [index_selected, setIndexSelected] = useState<number>(0);
    const socket = useSocket();

    const { count } = useSearchContext();

    const makeChoice = () => {
        socket?.emit("submitAnswer", { track: song_name_selected, artist: artist_name_selected, music_id: index_selected });
    }

    useEffect(() => {
        if (song_name_selected && artist_name_selected) {
            makeChoice();
        }
    }, [song_name_selected, artist_name_selected]);

    return (
        <div id="search_song_box">
            <div id="search_song_title">Which song?</div>
            

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
                                setIndexSelected(result.id);
                            }}
                            selected={result.id === index_selected}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default SearchSong;