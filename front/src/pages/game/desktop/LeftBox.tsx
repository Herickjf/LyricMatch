import React, { useEffect, useState } from "react";
import { useRoomContext } from "../../../utils/RoomContext";
// import { useRef } from "react";
import { useSocket } from "../../../utils/SocketContext";

import PlayerCard from "../../../utils/PlayerCard"
import '../../../css/game/desktop/leftBox.css'



const LeftBox: React.FC = () => {
    const [current_players, setCurrentPlayers] = useState<number>(0);
    const [max_players, setMaxPlayers] = useState<number>(0);
    const [current_round, setCurrentRound] = useState<number>(0);
    const [max_rounds, setMaxRounds] = useState<number>(0);

    const [room_code, setRoomCode] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const { room, players, player, setInGame } = useRoomContext();
    const socket = useSocket();
    
    useEffect(() => {
        setRoomCode(room?.code);
        setMaxPlayers(room?.maxPlayers);
        setCurrentPlayers(players?.length);
        setMaxRounds(room?.maxRounds);
        setCurrentRound(room?.currentRound);
    }
    , [players, room]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:3000?code=${room_code}`).then(() => {
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
                players.map((p: any) => (
                    <PlayerCard 
                        name={p.name} 
                        avatar={p.avatar} 
                        points={p.score} 
                        isHost={p.isHost}
                        hostView={player?.isHost} 
                        playerId={p.id}
                        socketId={p.socketId}
                        key={p.name} 
                    />
                ))

            }
            </div>

            <div id="actions">
                <button className="copy-code-button" onClick={() => {
                    socket?.emit("exitRoom")
                    setInGame(false);
                }}>
                    <i className="fa fa-sign-out" id="sign_out_invert"></i> 
                </button>
                <button className="copy-code-button" onClick={copyToClipboard}>
                    <i className="fa fa-share"></i> 
                </button>
                <button className="copy-code-button" onClick={copyToClipboard}>
                    <i className="fa fa-share"></i> 
                </button>
            </div>

            {showAlert && ( // Renderiza o alerta se showAlert for true
                <div className="custom-alert">
                    Code copied to the clipboard!
                </div>
            )}
        </div>
    )
}

export default LeftBox;