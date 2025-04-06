import React from "react";
import { useRoomContext } from "../../../utils/RoomContext";

import GameStart from "./middleframe_boxes/GameStart";
import SearchSong from "./middleframe_boxes/SearchSong";
import BetweenRounds from "./middleframe_boxes/BetweenRounds";
import Rankings from "./middleframe_boxes/Rankings";

import "../../../css/game/mobile/mobilemiddleframe.css"


interface MobileMiddleFrameProps {
    setFrame: (s: string) => void;
}

const MobileMiddleFrame: React.FC<MobileMiddleFrameProps> = ({ setFrame }) => {
    const { room } = useRoomContext();

    return (
        <div id="mobile_middle_frame">
            {(() => {
                switch (room.status) {
                    case "waiting":
                        return <GameStart/>
                    case "playing":
                        return <SearchSong setFrame={setFrame}/>
                    case "analyzing":
                        return <BetweenRounds setFrame={setFrame}/>
                    case "finished":
                        return <Rankings/>
                }
            })()}
        </div>
    );
}

export default MobileMiddleFrame;