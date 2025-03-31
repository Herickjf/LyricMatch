import React, { useState } from "react";

import { useSearchContext } from "../../../../utils/SearchContext";
import SongCard from "../../../../utils/SongCard";
import "../../../../css/game/desktop/rightbox_boxes/betweenrounds.css"

const BetweenRounds: React.FC = () => {
    const [api_selected, setApiSelected] = useState<number>(1);
    const [song_name_selected, setSongNameSelected] = useState<string>("");
    const [artist_name_selected, setArtistNameSelected] = useState<string>("");

    const { count } = useSearchContext();

    return (
        <div id="between_rounds_box">
            <div id="between_rounds_title">Which song?</div>
            
            <select id="between_rounds_select" value={api_selected} onChange={(e) => setApiSelected(Number(e.target.value))}>
                <option value={1}>LetrasMus</option>
                <option value={2}>MusixMatch</option>
                <option value={3}>Vagalume</option>
            </select>

            <div id="search_results_box">
                {
                    count.map((result: any, index: number) => (
                        <SongCard 
                            album_cover={result.album_image} 
                            song_name={result.track_name} 
                            artist_name={result.artist} key={index}
                            func={() => {
                                setSongNameSelected(result.track_name);
                                setArtistNameSelected(result.artist);
                            }}
                            selected={song_name_selected === result.track_name && artist_name_selected === result.artist}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default BetweenRounds;