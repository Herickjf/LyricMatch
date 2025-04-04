import { useState } from "react"
import { useRoomContext } from "../../../../utils/RoomContext"
import { useSocket } from "../../../../utils/SocketContext"
import SongPlayer from "./SongPlayer"
import Button from "../../../../utils/Button"
import { useSongContext } from "../../../../utils/SongContext"



const BetweenRounds: React.FC = () => {
    const socket = useSocket();
    const { player } = useRoomContext();
    const { song_selected } = useSongContext();

    const isTheHost = player.isHost;



    return (
        <div id="between_rounds_box">
            {
                song_selected &&
                <SongPlayer/>
            }
            
            {
                !song_selected &&
                <div id="between_rounds_song_not_entered">You entered no music...</div>
            }
            
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