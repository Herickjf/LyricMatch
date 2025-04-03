import { useSocket } from "../../../utils/SocketContext";
import { useState, useEffect } from "react";
import { useRoomContext } from '../../../utils/RoomContext';

import GameStart from "./midbox_boxes/GameStart"
import SearchSong from "./midbox_boxes/SearchSong"
import BetweenRounds from "./midbox_boxes/BetweenRounds"
import Rankings from "./midbox_boxes/Rankings"
import "../../../css/game/desktop/midBox.css"

const MidBox: React.FC = () =>{
    const [room_status, setRoomStatus] = useState<string>("analysing");
    const [loaded, setLoaded] = useState<boolean>(false);


    const socket = useSocket();
    const { room } = useRoomContext();

    useEffect(() => {
        if(loaded) return;
        setRoomStatus(room!.status);
        setLoaded(true);
    }, []);

    socket?.on("roomUpdate", (room) => {
        setRoomStatus(room.status);
    })

    return (
        <div id="mid_box">
            {(() => {
                switch (room_status) {
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