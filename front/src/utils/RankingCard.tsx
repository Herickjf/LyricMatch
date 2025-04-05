import '../css/utils/rankingCard.css';

interface RankingCardProps {
    avatar: string;
    name: string;
    position: number;
    score: number;
    isMe?: boolean;
}

const RankingCard: React.FC<RankingCardProps> = ({avatar, name, position, score, isMe}) => {
    return (
        <div className="ranking_card">
            <div id="player_info">
                <div className={`ranking_card_avatar ${position <= 3 ? `pos${position}` : ""}`}
                    style={{backgroundImage: `url(${avatar})`}}
                ></div>
                <div className={`ranking_card_name ${isMe? "is_the_user" : ""}`}>{name}</div>
            </div>
            <div className="ranking_card_position">{position}</div>
            <div className="ranking_card_score">{score}</div>
        </div>
    )
}

export default RankingCard;