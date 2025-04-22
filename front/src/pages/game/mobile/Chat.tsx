import "../../../css/game/mobile/chat.css";
import { useState } from "react";
import { useRoomContext } from "../../../utils/RoomContext";
import { useSocket } from "../../../utils/SocketContext"

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>("");
    const { room, players } = useRoomContext();
    const socket = useSocket();

    const sendMessage = () => {
        if (message.trim() !== "") {
            // Emit the message to the server
            socket?.emit("sendMessage", { message: message });
            setMessage(""); // Clear the input field after sending
        }
    };

    const getPlayerName = (playerId: string) => {
        return players?.find((player: any) => player.id == playerId)?.name;
    }

    return (
        <div id="mobile_chat_box">
            <div id="chat_messages_box">
                {
                    room?.messages.map((message: any, index: number) => {
                        return (
                            <div key={index} className="chat_message">
                                <span className="chat_message_sender">{getPlayerName(message.playerId)}</span>: <span className="chat_message_text">{message.message}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div id="chat_input_box">
                <input 
                    id="mobile_chat_input_text_input" 
                    type="text" placeholder="type your message..."
                    value={message}
                    onChange={(el) => setMessage(el.target.value)} 
                    onKeyDown={(event) => { if (event.key === "Enter") sendMessage() }}
                    autoComplete="off"
                />
                <button id="chat_send_button" onClick={() => {sendMessage()}}>
                    <i className="fa fa-paper-plane"></i>
                </button>
            </div>
        </div>
    )
}


export default Chat;