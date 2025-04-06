import React from "react";

import { useRoomContext } from "../../../utils/RoomContext";

import SearchSong from "./rightframe_boxes/SearchSong";
import BetweenRounds from "./rightframe_boxes/BetweenRounds";

import "../../../css/game/mobile/mobilerightframe.css";

interface MobileRightFrameProps {
    setFrame: (s: string) => void;
}

const MobileRightFrame: React.FC<MobileRightFrameProps> = ({ setFrame }) => {
    const { room } = useRoomContext();

    return (
        <div id="mobile_right_frame">
            {(() => {
                switch (room.status) {
                    case "playing":
                        return <SearchSong setFrame={setFrame}/>
                    case "analyzing":
                        return <BetweenRounds setFrame={setFrame}/>
                }
            })()}
        </div>
    );
}

export default MobileRightFrame;