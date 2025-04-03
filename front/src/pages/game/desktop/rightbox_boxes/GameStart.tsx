import {useSocket} from "../../../../utils/SocketContext"
import { useRoomContext } from "../../../../utils/RoomContext";
import "../../../../css/game/desktop/rightbox_boxes/gamestart.css"
import Button from "../../../../utils/Button"

const GameStart: React.FC = () => {
    const socket = useSocket();
    const { room } = useRoomContext();
    const hostPlayer: any = room?.players.find((player: any) => player.isHost && player.socketId == socket?.id);

    const startGame = () => {
        if(hostPlayer)
            socket?.emit("startGame", { hostId: hostPlayer.socketId });
    }



    return (
        <div id="game_start_box">
            <div id="game_start_title">Waiting for the host</div>

            {
                hostPlayer &&
                <div id="game_start_host_buttons">
                    {/* <button id="game_start_button_start_game" onClick={() => startGame()}>Start</button> */}
                    <Button id="game_start_button_start_game" func={startGame} text="Start"/>
                </div>
            }
        </div>
    )
}

export default GameStart;