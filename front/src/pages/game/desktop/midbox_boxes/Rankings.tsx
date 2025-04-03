import { useEffect, useState} from "react";
import { useRoomContext } from "../../../../utils/RoomContext";
import { useSocket } from "../../../../utils/SocketContext";
import RankingCard from "../../../../utils/RankingCard";

const Rankings: React.FC = () => {
    const { room } = useRoomContext();
    const { socket } = useSocket();
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        if (room) {
            const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
            setPlayers(sortedPlayers);
        }
    }
    , [room]);

    return (
        <div id="rankings_box">
            <div id="ranking_box_title">Ranking</div>

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
                        isMe={player.socketID == socket.id}
                    />
                ))}
            </div>

            <div id="ranking_box_footer">Congratulations!</div>
        </div>
    )
}

export default Rankings;