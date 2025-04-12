import { useSongContext } from "../../../../utils/SongContext";

import GuessCard from "../../../../utils/GuessCard";
import "../../../../css/game/desktop/rightbox_boxes/betweenRounds.css"

const BetweenRounds: React.FC = () => {
    const { guesses } = useSongContext();
    
    return (
        <div id="between_rounds_box">
            <div id="between_rounds_title">Players tried:</div>
            
            <div id="between_rounds_guesses_list">
            {
                guesses.map((guess: any, index: number) => (
                    <GuessCard
                        key={index}
                        song_param={guess}
                    />
                ))
            }
            </div>

        </div>
    )
}

export default BetweenRounds;