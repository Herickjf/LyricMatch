import { useRoomContext } from '../../../utils/RoomContext';

import GameStart from "./midbox_boxes/GameStart"
import SearchSong from "./midbox_boxes/SearchSong"
import BetweenRounds from "./midbox_boxes/BetweenRounds"
import Rankings from "./midbox_boxes/Rankings"
import "../../../css/game/desktop/midBox.css"

const MidBox: React.FC = () =>{
    const { room } = useRoomContext();

    return (
        <div id="mid_box">
            {(() => {
                switch (room.status) {
                    case "waiting":
                        return <GameStart/>
                    case "playing":
                        return <SearchSong/>
                    case "analyzing":
                        return <BetweenRounds/>
                    case "finished":
                        return <Rankings/>
                }
            })()}
        </div>
    )
}

export default MidBox;