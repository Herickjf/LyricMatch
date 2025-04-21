import React from "react";

import MobileLeftFrame from "./MobileLeftFrame";
import MobileMiddleFrame from "./MobileMiddleFrame";
import MobileRightFrame from "./MobileRightFrame";
import MobileChatFrame from "./MobileChatFrame";

import "../../../css/game/mobile/mainframe.css"
import { useSocket } from "../../../utils/SocketContext";
import { useRoomContext } from "../../../utils/RoomContext";

const MainFrame: React.FC = () => {
    const [lastFrame, setLastFrame] = React.useState<string>("middle_frame");
    const [frame, setFrame] = React.useState<string>("middle_frame");
    const socket = useSocket();
    const { room, setInGame } = useRoomContext();

    return (
        <div id="mobile_main_frame">
            <div id="mobile_main_frame_option_buttons">
                <button className="fa fa-sign-out"   onClick={() => {
                    socket?.emit("exitRoom")
                    setInGame(false);
                }}/>
                <button 
                    className={frame == "left_frame"? "fa fa-music" : "fa fa-users"}     
                    onClick={() => {
                        if (frame == "left_frame"){
                            setFrame(lastFrame);
                        }
                        else{
                            if (frame != "chat_frame")
                                setLastFrame(frame);
                            setFrame("left_frame");
                        }
                    }}
                />
                <button className="fa fa-comments" onClick={() => {
                    if (frame != "chat_frame"){
                        setLastFrame(frame);
                        setFrame("chat_frame");
                    }
                    else{
                        setFrame(lastFrame);
                    }
                }}/>
            </div>
            
            {frame === "left_frame"   && <MobileLeftFrame setFrame={setFrame} />}
            {frame === "middle_frame" && <MobileMiddleFrame setFrame={setFrame} />}
            {frame === "right_frame"  && <MobileRightFrame setFrame={setFrame} />}
            {frame === "chat_frame"   && <MobileChatFrame/>}
        </div>
    );
}

export default MainFrame;