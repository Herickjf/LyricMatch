import React from 'react';
import "../css/utils/playercard.css";

interface PlayerCardProps {
    name: string,
    avatar: string,
    points: number,
}

const PlayerCard: React.FC<PlayerCardProps> = ({name, avatar, points}) => {
    return (
        <div className="player-card">
            <div className="player-card-avatar" style={{backgroundImage: `url(${avatar})`}}/>
            <div className="player-card-infos">
                <div className="player-card-name">{name}</div>
                <div className="player-card-points">{points} points</div>
            </div>
        </div>
    );
}

export default PlayerCard;