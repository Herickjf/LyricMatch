import { useState } from "react"
import { useRoomContext } from "../../../../utils/RoomContext"
import { useSocket } from "../../../../utils/SocketContext"
import { useAudioSelectedContext } from "../../../../utils/AudioSelectedContext"
import SongPlayer from "./SongPlayer"



const BetweenRounds: React.FC = () => {
    const { room, setRoom } = useRoomContext()
    const { 
        artist, 
        song, 
        cover,
        audio, 
        correct,
        setArtist,
        setSong,
        setCover,
        setAudio,
        setCorrect,
    } = useAudioSelectedContext()
    const socket = useSocket()

    socket?.on("updateRoom", (room: any) => {
        setRoom(room)
    })

    socket?.on("roomAnswers", (data: any) => {
        console.log(data)
        if(data){
            data.answers.forEach((answer: any) => {
                if(answer.playerId == socket.id){
                    setCorrect(answer.is_correct)
                    setSong(answer.song_name)
                    setArtist(answer.artist_name)
                    setCover(answer.song_cover)
                    setAudio(answer.song_audio)
                    return;
                }
            })
        }
    })

    return (
        <div id="between_rounds_box">
            {/* <div id="between_rounds_word_box">{room!.currentWord}</div>

            <div id="between_rounds_subtitle_box">
                <p>For the word "{room!.currentWord}" you are...</p>
                <p>{correct? "RIGHTTT!" : "WROOONG!"}</p>
            </div>

            <div id="between_rounds_song_player_box">
                <div id="between_rounds_song_info">
                    <div id="between_rounds_song_cover" style={{backgroundImage: `url(${cover})`}}/>
                    <div id="between_rounds_song_description">
                        <h1>{song}</h1>
                        <h2>{artist}</h2>
                    </div>
                </div>

                <div id="between_rounds_song_player">
                    <audio controls src={audio} id="between_rounds_song_audio"/>
                </div>
            </div> */}

            <SongPlayer/>
        </div>
    )
}

export default BetweenRounds;