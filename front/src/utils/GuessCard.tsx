import { useAudioSelectedContext } from "./AudioSelectedContext";

interface GuessCardProps {
    player: string;
    song_name: string;
    artist_name: string;
    song_cover: string;
    is_correct: boolean;
    song_audio: string;
}

const GuessCard: React.FC<GuessCardProps> = ({
    player,
    song_name,
    artist_name,
    song_cover,
    is_correct,
    song_audio,
}) => {
    const { setArtist, setSong, setCover, setAudio, setCorrect } = useAudioSelectedContext()

    return (
        <div className="guess_card_box">
            <div className="guess_card_player_name">{player}</div>
            <div 
                className={`guess_card_song_info ${is_correct ? "guess_card_song_info_correct" : "guess_card_song_info_wrong"}`}
                onClick={() => {
                    setArtist(artist_name)
                    setSong(song_name)
                    setCover(song_cover)
                    setAudio(song_audio)
                    setCorrect(is_correct)
                }}
            >
                <div className="guess_card_song_cover" style={{backgroundImage: `url(${song_cover})`}}/>
                <div className="guess_card_song_description">
                    <h1>{song_name}</h1>
                    <h2>{artist_name}</h2>
                </div>
            </div>
        </div>
    )
}

export default GuessCard