import React, { useEffect, useState } from "react";
import { useRoomContext } from "../../../utils/RoomContext";
// import { useRef } from "react";
import { useSocket } from "../../../utils/SocketContext";

import PlayerCard from "../../../utils/PlayerCard";
import "../../../css/game/desktop/leftBox.css";

// Pega o BACKEND_URL do .env:
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const LeftBox: React.FC = () => {
  const [current_players, setCurrentPlayers] = useState<number>(0);
  const [max_players, setMaxPlayers] = useState<number>(0);
  const [current_round, setCurrentRound] = useState<number>(0);
  const [max_rounds, setMaxRounds] = useState<number>(0);
  const [player_list, setPlayerList] = useState<any>(null);

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

    setPlayerList(players?.sort((a: any, b: any) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return 0;
  }));
  }, [players, room]);

  const copyToClipboard = () => {
    const baseUrl = window.location.origin;
    const textToCopy = `${baseUrl}?code=${room_code}`;
    
    // Método moderno (recomendado)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showFeedback())
        .catch(() => useFallbackCopy(textToCopy));
    } else {
      // Método fallback para navegadores mais antigos
      useFallbackCopy(textToCopy);
    }
  };
  
  const useFallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Evita scroll para o elemento
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showFeedback();
      } else {
        console.error('Fallback copy method failed');
        // Pode adicionar um feedback visual alternativo aqui
      }
    } catch (err) {
      console.error('Error in fallback copy:', err);
    }
    
    document.body.removeChild(textarea);
  };
  
  const showFeedback = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div id="desktop_players_box" className="side_box">
      <div id="game_box_info">
        <div id="game_box_players">
          <span>{current_players}</span>/<span>{max_players}</span> Players
        </div>
        <div id="game_box_rounds">
          <span>{current_round}</span>/<span>{max_rounds}</span> Rounds
        </div>
      </div>

      <div id="desktop_players_list">

        {player_list?.map((p: any) => (
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
        ))}
        
      </div>

      <div id="actions">
        <button
          className="copy-code-button"
          onClick={() => {
            socket?.emit("exitRoom");
            setInGame(false);
          }}
        >
          <i className="fa fa-sign-out" id="sign_out_invert"></i>
        </button>
        <button className="copy-code-button" onClick={copyToClipboard}>
          <i className="fa fa-share"></i>
        </button>
        {/* <button className="copy-code-button" onClick={copyToClipboard}>
          <i className="fa fa-share"></i>
        </button> */}
      </div>

      {showAlert && ( // Renderiza o alerta se showAlert for true
        <div className="custom-alert">Code copied to the clipboard!</div>
      )}
    </div>
  );
};

export default LeftBox;
