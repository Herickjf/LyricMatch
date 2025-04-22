import React from "react";
import { useEffect, useState } from "react";
import { useRoomContext } from "../../../../utils/RoomContext";
import { useSocket } from "../../../../utils/SocketContext";
import RankingCard from "../../../../utils/RankingCard";

import "../../../../css/game/mobile/midframe/Rankings.css"

const Rankings: React.FC = () => {
    const { room, player } = useRoomContext();
    const socket = useSocket();
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        if (room) {
            const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
            setPlayers(sortedPlayers);
        }
    }
    , [room]);

    return (
        <div id="mobile_rankings_box">
            <div id="ranking_box_title">RANKING</div>

            <div id="ranking">
                <div id="rankings_header">
                    <div>Player</div>
                    <div>Pos</div>
                    <div>Score</div>
                </div>

                <div id="rankings_list">
                    {players.map((player, index) => (
                        <RankingCard
                            key={index}
                            avatar={player.avatar}
                            name={player.name}
                            position={index + 1}
                            score={player.score}
                            isMe={player.socketId == socket?.id}
                        />
                    ))}
                </div>
            </div>

            <div id="ranking_box_footer">Congratulations!</div>
            {
                player?.isHost &&
                <button id="mobile_restart_button" onClick={() => socket?.emit("resetRoom")}>Restart</button>
            }
        </div>
    )
}

export default Rankings;