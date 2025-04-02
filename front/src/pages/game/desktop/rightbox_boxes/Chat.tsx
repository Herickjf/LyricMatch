import "../../../../css/game/desktop/rightbox_boxes/chat.css"
import TextInput from "../../../../utils/TextInput";
import { useState } from "react";

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <div id="chat_box">
            <div id="chat_messages_box">
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
                ant <br/>
            </div>
            <div id="chat_input_box">
                <TextInput placeholder="type your message..." setText={setMessage} id="chat_input"/>
                <button id="chat_send_button">Send</button>
            </div>
        </div>
    )
}


export default Chat;