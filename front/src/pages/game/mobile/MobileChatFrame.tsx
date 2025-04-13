import Chat from "./Chat";
import "../../../css/game/mobile/mobilechatframe.css"

const MobileChatFrame: React.FC = () => {
    return (
        <div id="mobile_chat_frame_box">
            <div id="mobile_chat_frame">
                <Chat/>
            </div>
        </div>
    );
}

export default MobileChatFrame;