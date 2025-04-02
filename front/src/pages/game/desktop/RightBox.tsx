import '../../../css/game/desktop/rightBox.css'
import { useEffect, useState } from 'react';
import { useSocket } from '../../../utils/SocketContext';
import { useRoomContext } from '../../../utils/RoomContext';

import BetweenRounds from './rightbox_boxes/BetweenRounds';
import GameStart from './rightbox_boxes/GameStart';
import Rankings from './rightbox_boxes/Rankings';
import SearchSong from './rightbox_boxes/SearchSong';
import Chat from './rightbox_boxes/Chat';

const RightBox: React.FC = () =>{
    const [room_status, setRoomStatus] = useState<string>("playing");
    const [loaded, setLoaded] = useState<boolean>(false);

    const socket = useSocket();
    const { room, setRoom } = useRoomContext();

    useEffect(() => {
        if(loaded) return;
        setLoaded(true);
        setRoomStatus(room!.status);
    }, []);

    socket?.on("roomUpdate", (room) => {
        console.log(room)
        setRoomStatus(room.status);
        setRoom(room);
    })

    return (
        <div id="right_box" className='side_box'>
            {(() => {
                switch (room_status) {
                    case "waiting":
                        return <GameStart/>;
                    case "playing":
                        return <SearchSong/>;
                    case "analyzing":
                        return <BetweenRounds/>;
                    case "finished":
                        return <Rankings/>;
                }
            })()}

            <Chat/>
        </div>
    )
}

export default RightBox;