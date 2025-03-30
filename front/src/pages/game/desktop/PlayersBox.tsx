import React, { useState } from "react";
import { useSocket } from "../../../utils/SocketContext";


const PlayersBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>();
    const [max_players, setMaxPlayers] = useState<number>();

    const socket = useSocket();

    function Players(){
        socket.on("game:players", (data: any) => {
            setCurrentPlayers(data.current_players);
            setMaxPlayers(data.max_players);
        });

    }

    return(
        <div id="desktop_players_box" className="game_box">
            <div className="game_box_title">Players (<span>{current_players}</span> / <span>{max_players}</span>)</div>
            
            {Players()}
        </div>
    )
}

export default PlayersBox;