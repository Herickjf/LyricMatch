import { useState } from "react"
import { useRoomContext } from "../../../../utils/RoomContext"
import { useSocket } from "../../../../utils/SocketContext"
import { useAudioSelectedContext } from "../../../../utils/SongContext"
import SongPlayer from "./SongPlayer"
import Button from "../../../../utils/Button"



const BetweenRounds: React.FC = () => {
    const socket = useSocket();
    const { players } = useRoomContext();

    const isTheHost = players.find((player: any) => player.isHost && player.socketId == socket?.id);



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
            
            {
                isTheHost &&
                <Button text="Next Round" func={() => {
                    socket?.emit("nextRound")
                }}/>
            }
        </div>
    )
}

export default BetweenRounds;