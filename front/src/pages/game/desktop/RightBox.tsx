import '../../../css/game/desktop/rightBox.css'
import { useState } from 'react';
import { useSocket } from '../../../utils/SocketContext';

import BetweenRounds from './rightbox_boxes/BetweenRounds';
import Chat from './rightbox_boxes/Chat';

const RightBox: React.FC = () =>{
    const [room_status, setRoomStatus] = useState<string>("between_rounds");

    const socket = useSocket();

    socket?.on("update_room", (room) => {
        setRoomStatus(room.status);
    })

    return (
        <div id="right_box" className='side_box'>
            {(() => {
                switch (room_status) {
                    case "between_rounds":
                        return <BetweenRounds/>
                }
            })()}

            <Chat/>
        </div>
    )
}

export default RightBox;