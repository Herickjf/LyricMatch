import { useState } from "react"

const BetweenRounds: React.FC = () => {
    const [word_of_round, setWordOfRound] = useState<string>("")
    const [is_correct, setIsCorrect] = useState<boolean>(false)
    const [song_name, setSongName] = useState<string>("")
    const [song_artist, setSongArtist] = useState<string>("")
    const [song_cover, setSongCover] = useState<string>("")
    const [song_audio, setSongAudio] = useState<string>("")

    return (
        <div id="between_rounds_box">
            <div id="between_rounds_word_box">{word_of_round}</div>

            <div id="between_rounds_subtitle_box">
                <p>For the word "{word_of_round}" you are...</p>
                <p>{is_correct? "RIGHTTT!" : "WROOONG!"}</p>
            </div>

            <div id="between_rounds_song_player_box">
                <div id="between_rounds_song_info">
                    <div id="between_rounds_song_cover" style={{backgroundImage: `url(${song_cover})`}}/>
                    <div id="between_rounds_song_description">
                        <h1>{song_name}</h1>
                        <h2>{song_artist}</h2>
                    </div>
                </div>

                <div id="between_rounds_song_player">
                    <audio controls src={song_audio} id="between_rounds_song_audio"/>
                </div>
            </div>
        </div>
    )
}

export default BetweenRounds;