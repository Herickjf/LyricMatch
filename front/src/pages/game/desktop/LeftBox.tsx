import React, { useState } from "react";
import { useSocket } from "../../../utils/SocketContext";

import PlayerCard from "../../../utils/PlayerCard"
import '../../../css/game/desktop/leftBox.css'

const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(1);
    const [player_list, setPlayerList] = useState<any[]>([]);

    const socket = useSocket();

    socket?.on("update_players", (data) => {
        setPlayerList(data);
        setCurrentPlayers(data.length);
    })

    return(
        <div id="desktop_players_box" className="side_box">
            <div className="game_box_title"><span>{current_players}</span> Players:</div>

            <div id="desktop_players_list">
            {
                player_list.map((player) => (
                    <PlayerCard name={player.name} avatar={player.avatar} points={player.points} key={player.name} />
                ))
            }
                <PlayerCard name={"bixin la"} avatar="http://localhost:4000/images/avatar1.png" points={256} key="key1" />
                <PlayerCard name={"coisinho"} avatar="http://localhost:4000/images/avatar2.png" points={128} key="key2" />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar3.png" points={64} key="key3" />
            </div>
        </div>


    )
}

export default LeftBox;