import React from "react";
import { useEffect, useState } from "react";
import { useSocket } from "../../../../utils/SocketContext";
import { useSearchContext } from "../../../../utils/SearchContext";
import SongCard from "../../../../utils/SongCard";

import "../../../../css/game/mobile/rightframe/SearchSong.css";

interface SearchSongProps {
    setFrame: (s: string) => void;
}

const SearchSong: React.FC<SearchSongProps> = ({setFrame}) => {
    const [api_selected, setApiSelected] = useState<string>("MUSIXMATCH");
    const [song_name_selected, setSongNameSelected] = useState<string>("");
    const [artist_name_selected, setArtistNameSelected] = useState<string>("");
    const [index_selected, setIndexSelected] = useState<number>(0);
    const socket = useSocket();

    const { count } = useSearchContext();

    const makeChoice = () => {
        socket?.emit("submitAnswer", { musicApi: api_selected, track: song_name_selected, artist: artist_name_selected, music_id: index_selected});
    }

    useEffect(() => {
        if (song_name_selected && artist_name_selected) {
            makeChoice();
        }
    }, [song_name_selected, artist_name_selected, api_selected]);

   

    return (
        <div id="MOBILE_search_song_box">
            <div className="fa fa-arrow-left" id="mobile_search_song_button_return" onClick={() => setFrame("middle_frame")}/>
            <div id="search_song_title">Which song?</div>
            
            <select id="search_song_select" value={api_selected} onChange={(e) => setApiSelected(e.target.value)}>
                <option value={"MUSIXMATCH"}>MusixMatch</option>
                <option value={"LETRAS"}>LetrasMus</option>
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