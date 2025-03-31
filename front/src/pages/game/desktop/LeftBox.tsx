import React, { useEffect, useState } from "react";
import { useSocket } from "../../../utils/SocketContext";
import { usePlayerEntryContext } from "../../../utils/PlayerEntryContext";
import { useRef } from "react";

import PlayerCard from "../../../utils/PlayerCard"
import '../../../css/game/desktop/leftBox.css'


const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(0);
    const [room_code, setRoomCode] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number>(0);
    const [player_list, setPlayerList] = useState<any[]>([]);

    const socket = useSocket();

    const { playerEntrando, salaCriada } = usePlayerEntryContext() as { 
        playerEntrando: any; 
        salaCriada: any; 
    };
    const already_done = useRef(false);

    useEffect(() => {
        if("players" in salaCriada!) {
            setRoomCode(salaCriada!.code as string);
            setPlayerList([...(salaCriada!.players as any[])]);
            setCurrentPlayers(salaCriada!.players.length as number);
            setMaxPlayers(salaCriada!.maxPlayers as number);
            already_done.current = true;

        }else {
            setRoomCode(salaCriada!.code as string);
            setPlayerList((prev) => [...prev, playerEntrando]);
            setCurrentPlayers((prev) => prev + 1);
            setMaxPlayers(salaCriada!.maxPlayers as number);
            already_done.current = true;
        }
        }
    
    , []);

    socket?.on("roomUpdate", (data) => {
        console.log(data);
        setMaxPlayers(data.room.maxPlayers);
        setPlayerList([...data.room.players]);
        setCurrentPlayers(data.room.players.length);
    })

    return(
        <div id="desktop_players_box" className="side_box">
            <div id="game_box_title">{current_players}/{max_players} Players Code: {room_code}</div>

            <div id="desktop_players_list">
            {
                player_list.map((player) => (
                    <PlayerCard name={player.name} avatar={player.avatar} points={player.score} key={player.name} />
                ))
            }
            </div>
        </div>


    )
}

export default LeftBox;