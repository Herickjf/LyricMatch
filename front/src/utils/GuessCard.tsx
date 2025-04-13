import { useRoomContext } from "./RoomContext";
import { useSongContext } from "./SongContext";
import "../css/utils/guesscard.css"

interface GuessCardProps {
    song_param: any;
    change_screen?: (s: string) => void;
}

const GuessCard: React.FC<GuessCardProps> = ({
        song_param,
        change_screen,
    }) => {
    const { setSongSelected } = useSongContext();
    const { player } = useRoomContext();


    return (
        <div className="guess_card_box">
            <div className="guess_card_player_name">{player?.name}:</div>
            <div 
                className={`guess_card_song_info ${song_param.isCorrect ? "guess_card_song_info_correct" : "guess_card_song_info_wrong"}`}
                onClick={() => {
                    setSongSelected(song_param)
                    if(change_screen) {
                        change_screen("middle_frame")
                    }
                }}>
                    
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