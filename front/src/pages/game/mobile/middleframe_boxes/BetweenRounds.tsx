import React from "react";
import { useRoomContext } from "../../../../utils/RoomContext";
import { useSongContext } from "../../../../utils/SongContext";
import { useSocket } from "../../../../utils/SocketContext";
import Button from "../../../../utils/Button";
import SongPlayer from "./SongPlayer";
import "../../../../css/game/mobile/midframe/BetweenRounds.css"


interface BetweenRoundsProps {
    setFrame: (s: string) => void;
}


const BetweenRounds: React.FC<BetweenRoundsProps> = ({setFrame}) => {
    const socket = useSocket();
    const { player, room } = useRoomContext();
    const { song_selected } = useSongContext();

    const isTheHost = player.isHost;

    return (
        <div id="mobile_between_rounds_mid_box">
            <div id="search_song_word_box">{room.currentWord}</div>

            {   song_selected &&
                <div id="other_songs_tip">Click in the <span className="goto_other_songs" onClick={()=>{setFrame("right_frame")}}>other's songs</span> to listen them!</div>
            }

            {
                song_selected ?
                <SongPlayer/>
                :
                <div className="between_rounds_song_not_entered_box">
                    <div id="between_rounds_song_not_entered">You entered no music...</div>
                    <div id="between_rounds_song_not_entered_tip">Click in the <span className="goto_other_songs" onClick={()=>{setFrame("right_frame")}}>other's songs</span> to listen them!</div>
                </div>

            }
            
            {
                isTheHost ?
                <Button text={`${room.currentRound < room.maxRounds ? "Next Round" : "Rankings"}`} func={() => {
                    if(room.currentRound >= room.maxRounds) {
                        socket?.emit("getRankings")
                    }else{
                        socket?.emit("nextRound")   
                    }
                }}/>
                :
                <div id="between_rounds_waiting">Waiting for the host...</div>
            }
        </div>
    )
}

export default BetweenRounds;