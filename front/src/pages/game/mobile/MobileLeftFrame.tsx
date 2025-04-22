import React from "react";

interface MobileLeftFrameProps {
    setFrame: (s: string) => void;
}

import { useEffect, useState } from "react";
import { useRoomContext } from "../../../utils/RoomContext";
import PlayerCard from "../../../utils/PlayerCard";
import "../../../css/game/mobile/mobileleftframe.css"

const MobileLeftFrame: React.FC<MobileLeftFrameProps> = ({ setFrame }) => {
    const [current_players, setCurrentPlayers] = useState<number>(0);
    const [max_players, setMaxPlayers] = useState<number>(0);
    const [current_round, setCurrentRound] = useState<number>(0);
    const [max_rounds, setMaxRounds] = useState<number>(0);
    const [player_list, setPlayerList] = useState<any>(null);

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
        setPlayerList(players?.sort((a: any, b: any) => {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return 0;
        }));
    }
    , [players, room])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:3000?code=${room_code}`).then(() => {
            setShowAlert(true); // Exibe o alerta
            setTimeout(() => setShowAlert(false), 3000); // Oculta o alerta após 3 segundos
        }).catch((err) => {
            console.error("Erro ao copiar o código:", err);
        });
    };

    return(
        <div id="mobile_players_box_background" className="side_box">
            <div id="mobile_players_box_content">
            <div id="game_box_info">
                <div id="game_box_players"><span>{current_players}</span>/<span>{max_players}</span> Players</div>
                <div id="game_box_rounds"><span>{current_round}</span>/<span>{max_rounds}</span> Rounds</div>
            </div>

            <div id="mobile_players_list">
            {
                player_list?.map((player: any) => (
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

            <button className="mobile-copy-code-button" onClick={copyToClipboard}>Share</button>

            {showAlert && ( // Renderiza o alerta se showAlert for true
                <div className="custom-alert">
                    Code copied to the clipboard!
                </div>
            )}
            </div>
        </div>
    )
}

export default MobileLeftFrame;