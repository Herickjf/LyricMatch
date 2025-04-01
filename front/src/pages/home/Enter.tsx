import TextInput from '../../utils/TextInput'
import Button from '../../utils/Button'
import "../../css/utils/form.css"
import Alert from '../../utils/Alert'
import { useSocket } from '../../utils/SocketContext'
import { useRoomContext } from '../../utils/RoomContext'

import { useState, useEffect } from 'react';

interface EnterProps {
    username: string,
    avatar: number | string
}


const Enter: React.FC<EnterProps> = ({ username, avatar}) => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomPassword, setRoomPassword] = useState<string>("");
    const [alert, setAlert] = useState<{title: string, message: string} | null>(null);
    const socket = useSocket();

    const { setRoom, setPlayers, setInGame, in_game } = useRoomContext();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code") || "";
        setRoomCode(code);
    }, []);

    function handleEnterRoom() {
        if(username.length < 1) {
            setAlert({ title: "Input Error", message: "Please, set a username first." });
            return;
        }

        if (roomCode.length < 1) {
            setAlert({ title: "Input Error", message: "Please, set a room code first." });
            return;
        }

        if (roomPassword.length < 1) {
            setAlert({ title: "Input Error", message: "Please, set a room password first." });
            return;
        }

        socket?.emit("joinRoom", {
            code: roomCode,
            player: {
                name: username,
                avatar: avatar
            },
            password: roomPassword
        })

        socket?.on("roomUpdate", (data) => {
            if(in_game) return;
            console.log(data)
            setRoom(data);
            setPlayers([...data!.players]);
            setInGame(true);
        });

        socket?.on("error", (error) => {
            setAlert({ title: "Join Room Error", message: error.message });
        });
    }

    return(
        <div className="form_box">
            
            <TextInput label="Code:" placeholder='Enter the room code' setText={setRoomCode} value={roomCode}/>
            <TextInput label="Password:" placeholder='Enter the room password' setText={setRoomPassword}/>

            <Button 
                text="Enter room" 
                func={handleEnterRoom}
            />

            {alert && <Alert title={alert.title} message={alert.message} />}
        </div>
    )
}

export default Enter