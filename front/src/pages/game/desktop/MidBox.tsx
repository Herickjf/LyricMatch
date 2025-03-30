import { useSocket } from "../../../utils/SocketContext";
import { useState } from "react";

import GameStart from "./midbox_boxes/GameStart"
import SearchSong from "./midbox_boxes/SearchSong"
import BetweenRounds from "./midbox_boxes/BetweenRounds"
import Rankings from "./midbox_boxes/Rankings"
import "../../../css/game/desktop/midbox.css"

const MidBox: React.FC = () =>{
    const [room_status, setRoomStatus] = useState<string>("in_round");

    const socket = useSocket();

    socket?.on("update_room", (room) => {
        setRoomStatus(room.status);
    })

    return (
        <div id="mid_box">
            {(() => {
                switch (room_status) {
                    case "game_start":
                        return <GameStart/>
                    case "in_round":
                        return <SearchSong/>
                    case "between_rounds":
                        return <BetweenRounds/>
                    case "rankings":
                        return <Rankings/>
                }
            })()}
        </div>
    )
}

export default MidBox;