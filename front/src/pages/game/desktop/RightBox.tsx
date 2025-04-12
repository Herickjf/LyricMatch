import '../../../css/game/desktop/rightBox.css'
import { useEffect, useState } from 'react';
import { useRoomContext } from '../../../utils/RoomContext';

import BetweenRounds from './rightbox_boxes/BetweenRounds';
import GameStart from './rightbox_boxes/GameStart';
import Rankings from './rightbox_boxes/Rankings';
import SearchSong from './rightbox_boxes/SearchSong';
import Chat from './rightbox_boxes/Chat';

const RightBox: React.FC = () =>{
    const [room_status, setRoomStatus] = useState<string>("waiting");
    const [loaded, setLoaded] = useState<boolean>(false);

    const { room } = useRoomContext();

    useEffect(() => {
        if(loaded) return;
        setLoaded(true);
        setRoomStatus(room!.status);
    }, []);

    useEffect(() => {
        setRoomStatus(room!.status);
    }, [room]);

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