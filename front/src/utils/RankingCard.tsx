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
            <div className="ranking_card_avatar" style={{backgroundImage: `url(${avatar})`}}></div>
            <div className={`ranking_card_name ${isMe? "isTheUser" : ""}`}>{name}</div>
            <div className="ranking_card_position">{position}</div>
            <div className="ranking_card_score">{score}</div>
        </div>
    )
}

export default RankingCard;