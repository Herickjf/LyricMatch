const Chat: React.FC = () => {
    return (
        <div id="chat_box">
            <div id="chat_messages_box"></div>
            <div id="chat_input_box">
                <input type="text" id="chat_input" placeholder="Type your message..." />
                <button id="chat_send_button">Send</button>
            </div>
        </div>
    )
}


export default Chat;