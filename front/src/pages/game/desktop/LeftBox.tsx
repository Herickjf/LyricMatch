import React, { useState } from "react";
import { useSocket } from "../../../utils/SocketContext";

import PlayerCard from "../../../utils/PlayerCard"


const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(1);
    const [player_list, setPlayerList] = useState<any[]>([]);

    const socket = useSocket();

    socket?.on("update_players", (data) => {
        setPlayerList(data);
        setCurrentPlayers(data.length);
    })

    return(
        <div id="desktop_players_box" className="game_box">
            <div className="game_box_title"><span>{current_players}</span> Players:</div>

            <div id="desktop_players_list">
            {
                player_list.map((player) => (
                    <PlayerCard name={player.name} avatar={player.avatar} points={player.points} key={player.name} />
                ))
            }
            </div>
        </div>


    )
}

export default LeftBox;