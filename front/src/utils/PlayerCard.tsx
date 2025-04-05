import React from 'react';
import "../css/utils/playercard.css";
import { useSocket } from './SocketContext';

interface PlayerCardProps {
    name: string,
    avatar: string,
    points: number,
    isHost?: boolean,
    hostView?: boolean
    playerId?: string
    socketId?: string
}

const PlayerCard: React.FC<PlayerCardProps> = ({name, avatar, points, isHost, hostView, playerId, socketId}) => {
    const socket = useSocket();
    
    const turnHost = () => {
        socket?.emit("changeHost", {playerId: playerId});
    }

    const expel = () => {
        socket?.emit("expelPlayer", {playerId: playerId, socketId: socketId});
    }

    return (
        <div className={`player-card ${isHost ? "host" : ""}`}>
            <div className="player-card-avatar" style={{backgroundImage: `url(${avatar})`}}>
                {isHost && <div className="player-card-host-icon fa fa-crown"></div>}
            </div>
            <div className="player-card-infos">
                {
                    hostView && !isHost && 
                    <div className="player-card-host-options">
                        <i className="fa fa-crown player-card-host-options-turn-to-host" onClick={() => turnHost()}></i>
                        <i className="fa fa-times-circle player-card-host-options-kick" onClick={() => expel()}></i>
                    </div>
                }
                <div className="player-card-name">{name}</div>
                <div className="player-card-points">{points} points</div>
            </div>
        </div>
    );
}

export default PlayerCard;