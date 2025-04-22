import Button from "../../../../utils/Button";
import { useRoomContext } from "../../../../utils/RoomContext";
import { useSocket } from "../../../../utils/SocketContext";
import "../../../../css/game/desktop/rightbox_boxes/rankings.css"


const Rankings: React.FC = () => {
    const { player, setInGame } = useRoomContext();
    const socket = useSocket();

    return (
        <div id="rankings_box_right_box">
            <div id="rankings_title">Match Ended!</div>
            

            <div id="rankings_right_box_buttons">
                {
                    player?.isHost &&
                    <Button 
                        text="Restart"
                        func={() => {
                            socket?.emit("resetRoom");
                        }}
                    />
                }

            </div>
            
        </div>
    )
}

export default Rankings;