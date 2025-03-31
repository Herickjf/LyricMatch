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
            <div id="game_box_title"><span>{current_players}</span> Players:</div>

            <div id="desktop_players_list">
            {
                player_list.map((player) => (
                    <PlayerCard name={player.name} avatar={player.avatar} points={player.points} key={player.name} />
                ))
            }
                <PlayerCard name={"bixin la"} avatar="http://localhost:4000/images/avatar30.png" points={256} />
                <PlayerCard name={"coisinho"} avatar="http://localhost:4000/images/avatar31.png" points={128} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar29.png" points={64} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar35.png" points={32} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar33.png" points={16} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar34.png" points={8} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar38.png" points={4} />
                <PlayerCard name={"veyr"} avatar="http://localhost:4000/images/avatar39.png" points={2} />
            </div>
        </div>


    )
}

export default LeftBox;