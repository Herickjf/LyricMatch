import React, { useState } from "react";

import { useSearchContext } from "../../../../utils/SearchContext";
import SongCard from "../../../../utils/SongCard";

const BetweenRounds: React.FC = () => {
    const [api_selected, setApiSelected] = useState<number>(1);

    const { count } = useSearchContext();

    return (
        <div id="between_rounds_box">
            <h1>Which song?</h1>
            
            <select id="between_rounds_select" value={api_selected} onChange={(e) => setApiSelected(Number(e.target.value))}>
                <option value={1}>Letras Mus</option>
                <option value={2}>MusixMatch</option>
                <option value={3}>Vagalume</option>
            </select>

            <div id="search_results_box">
                {
                    count.map((result: any, index: number) => (
                        <SongCard album_cover={result.album_image} song_name={result.track_name} artist_name={result.artist} key={index}/>
                    ))
                }
            </div>
        </div>
    )
}

export default BetweenRounds;