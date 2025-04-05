import React, { useEffect, useState } from "react";
import { useSocket } from "../../../utils/SocketContext";
import { useRoomContext } from "../../../utils/RoomContext";
// import { usePlayerEntryContext } from "../../../utils/PlayerEntryContext";
// import { useRef } from "react";

import PlayerCard from "../../../utils/PlayerCard"
import '../../../css/game/desktop/leftBox.css'



const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(0);
    const [max_players, setMaxPlayers] = useState<number>(0);
    const [current_round, setCurrentRound] = useState<number>(0);
    const [max_rounds, setMaxRounds] = useState<number>(0);

    const [room_code, setRoomCode] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const { room, players, player } = useRoomContext();
    const isTheHost = player?.isHost;
    
    useEffect(() => {
        setRoomCode(room?.code);
        setMaxPlayers(room?.maxPlayers);
        setCurrentPlayers(players?.length);
        setMaxRounds(room?.maxRounds);
        setCurrentRound(room?.currentRound);
    }
    , [players, room])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:5173?code=${room_code}`).then(() => {
            setShowAlert(true); // Exibe o alerta
            setTimeout(() => setShowAlert(false), 3000); // Oculta o alerta após 3 segundos
        }).catch((err) => {
            console.error("Erro ao copiar o código:", err);
        });
    };

    return(
        <div id="desktop_players_box" className="side_box">
            <div id="game_box_info">
                <div id="game_box_players"><span>{current_players}</span>/<span>{max_players}</span> Players</div>
                <div id="game_box_rounds"><span>{current_round}</span>/<span>{max_rounds}</span> Rounds</div>
            </div>

            <div id="desktop_players_list">
            {
                players.map((player: any) => (
                    <PlayerCard 
                        name={player.name} 
                        avatar={player.avatar} 
                        points={player.score} 
                        isHost={player.isHost}
                        hostView={isTheHost} 
                        playerId={player.id}
                        socketId={player.socketId}
                        key={player.name} 
                    />
                ))

            }
            </div>

            <button className="copy-code-button" onClick={copyToClipboard}>Share</button>

            {showAlert && ( // Renderiza o alerta se showAlert for true
                <div className="custom-alert">
                    Code copied to the clipboard!
                </div>
            )}
        </div>
    )
}

export default LeftBox;