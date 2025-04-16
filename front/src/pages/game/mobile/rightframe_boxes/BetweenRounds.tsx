import React from "react";
import { useSongContext } from "../../../../utils/SongContext";
import GuessCard from "../../../../utils/GuessCard";
import "../../../../css/game/mobile/rightframe/BetweenRounds.css"

interface BetweenRoundsProps {
    setFrame: (s: string) => void;
}


const BetweenRounds: React.FC<BetweenRoundsProps> = ({setFrame}) => {
    const { guesses } = useSongContext();

    return (
        <div id="mobile_between_rounds_box">
            <div className="fa fa-arrow-left" id="mobile_between_return_button" onClick={()=>{setFrame("middle_frame")}}></div>
            <div>
                <div id="mobile_between_rounds_title">Players tried:</div>
                <div id="mobile_between_rounds_subtitle">Click on the song to listen!</div>
            </div>
            
            <div id="mobile_between_rounds_guesses_list">
            {
                guesses?.map((guess: any, index: number) => (
                    <GuessCard
                        key={index}
                        song_param={guess}
                        change_screen={setFrame}
                    />
                ))
            }
            </div>

        </div>
    );
}

export default BetweenRounds;