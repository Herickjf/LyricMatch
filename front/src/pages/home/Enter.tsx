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
    const [alert_active, setAlertActive] = useState<boolean>(false);
    const [alert_message, setAlertMessage] = useState<string>("");
    const socket = useSocket();

    const { setInGame, in_game } = useRoomContext();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code") || "";
        setRoomCode(code);
    }, []);

    function handleEnterRoom() {
        if(username.length < 1) {
            setAlertMessage("Input Error: Please, set a username first.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }

        if (roomCode.length < 1) {
            setAlertMessage("Input Error: Please, set a room code.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }

        if (roomPassword.length < 1) {
            setAlertMessage("Input Error: Please, set a room password.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
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
            setInGame(true);
        });

        socket?.on("error", (error) => {
            setAlertMessage(error);
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
        });
    }

    return(
        <div className="form_box">
            

            <TextInput label="Code:" placeholder='Enter the room code' setText={setRoomCode} value={roomCode}/>
            <TextInput label="Password:" placeholder='Enter the room password' setText={setRoomPassword} enterFunc={handleEnterRoom}/>
    

            <Button 
                text="Enter room" 
                func={handleEnterRoom}
            />

            {
                alert_active &&
                <div className="custom-alert">
                    {alert_message}
                </div>
            }
        </div>
    )
}

export default Enter