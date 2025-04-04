import { useRoomContext } from "./RoomContext";
import { useSongContext } from "./SongContext";
import "../css/utils/guesscard.css"

interface GuessCardProps {
    song_param: any;
}

const GuessCard: React.FC<GuessCardProps> = ({
    song_param
}) => {
    const { setSongSelected } = useSongContext();
    const { players } = useRoomContext();

const player = players.find((player: any) => player.id == song_param.playerId);

    return (
        <div className="guess_card_box">
            <div className="guess_card_player_name">{player.name}:</div>
            <div 
                className={`guess_card_song_info ${song_param.isCorrect ? "guess_card_song_info_correct" : "guess_card_song_info_wrong"}`}
                onClick={() => {
                    setSongSelected(song_param)
                }}
            >
                <div className="guess_card_song_cover" style={{backgroundImage: `url(${song_param.albumImage})`}}/>
                <div className="guess_card_song_description">
                    <div className="guess_card_song_name">{song_param.track}</div>
                    <div className="guess_card_artist_name">{song_param.artist}</div>
                </div>
            </div>
        </div>
    )
}

export default GuessCard