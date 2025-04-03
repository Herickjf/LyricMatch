import React, { useEffect, useState } from "react";
import { useSocket } from "../../../utils/SocketContext";
import { useRoomContext } from "../../../utils/RoomContext";
// import { usePlayerEntryContext } from "../../../utils/PlayerEntryContext";
// import { useRef } from "react";

import PlayerCard from "../../../utils/PlayerCard"
import '../../../css/game/desktop/leftBox.css'



const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(0);
    const [room_code, setRoomCode] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number>(0);
    const [player_list, setPlayerList] = useState<any[]>([]);

    const { room, players } = useRoomContext();
    const [ already_joined, setAlreadyJoined ] = useState<boolean>(false);


    
    useEffect(() => {
        if(already_joined) return;
        console.log(room)
        setRoomCode(room!.code);
        setMaxPlayers(room!.maxPlayers);
        setCurrentPlayers(players.length);
        setPlayerList([...players]);
        setAlreadyJoined(true);
    }
    , [])

    useEffect(() => {
        setRoomCode(room!.code);
        setMaxPlayers(room!.maxPlayers);
        setCurrentPlayers(room!.players.length);
        setPlayerList([...room!.players]);
    }, [room])

    return(
        <div id="desktop_players_box" className="side_box">
            <div id="game_box_title">{current_players}/{max_players} Players</div>

            <div id="desktop_players_list">
            {
                player_list.map((player) => (
                    <PlayerCard name={player.name} avatar={player.avatar} points={player.score} isHost={player.isHost} key={player.name} />
                ))

            }
                {/* <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar32.png"/>
                <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar30.png"/>
                <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar37.png"/>
                <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar38.png"/>
                <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar35.png"/>
                <PlayerCard name="Fulano" points={20} avatar="http://localhost:4000/images/avatar29.png"/> */}
            </div>
            
            <a href={`http://localhost:5173?code=${room_code}`} target="blank">Copiar Código</a>
        </div>
    )
}

export default LeftBox;