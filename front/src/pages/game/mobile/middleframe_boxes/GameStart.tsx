import '../../../../css/game/mobile/midframe/GameStart.css'
import Button from '../../../../utils/Button';
import { useRoomContext } from '../../../../utils/RoomContext';
import { useSocket } from '../../../../utils/SocketContext';

const GameStart: React.FC = () => {
    const socket = useSocket();
    const { player } = useRoomContext();



    return (
        <div id="mobile_game_start">
            <div id="mobile_spinning_logo"/>
            {
                player?.isHost ?
                <Button
                    text="Start Game"
                    func={() => {socket?.emit("startGame")}} // Placeholder for the start game function
                />
                :
                <div id="mobile_game_start_text">Waiting for the host to start the game</div>
            }
        </div>
    )
}

export default GameStart;