import TextInput from "../../utils/TextInput"
import Button from "../../utils/Button"
import NumberInput from "../../utils/NumberInput"
import { useSocket } from "../../utils/SocketContext"
import { useRoomContext } from "../../utils/RoomContext"

import "../../css/utils/form.css"
import "../../css/utils/input.css"

import { useState, useEffect } from "react"

interface CreateProps {
    username: string,
    avatar: number | string
}

const Create: React.FC<CreateProps> = ({username, avatar}) => {
    const [password, setPassword] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number>(3);
    const [max_rounds, setMaxRounds] = useState<number>(1);
    const [language, setLanguage] = useState<"PT" | "EN" | "SP">("EN");
    const [alert_active, setAlertActive] = useState<boolean>(false);
    const [alert_message, setAlertMessage] = useState<string>("");
    const socket = useSocket();
    const { setInGame, in_game } = useRoomContext();




    async function handleCreateRoom() {
        if (username.length < 1) {
            setAlertMessage("Input Error: Please, set a username first.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }
        if (password.length < 1) {
            setAlertMessage("Input Error: Please, set a password.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }
        if (max_players < 1 || max_players > 100) {
            setAlertMessage("Input Error: Max players must be between 1 and 100.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }
        if (max_rounds < 1 || max_rounds > 50) {
            setAlertMessage("Input Error: Max rounds must be between 1 and 50.");
            setAlertActive(true);
            setTimeout(() => {
                setAlertActive(false);
            }, 3000);
            return;
        }

        
        let data = null;
        try{
            const response = await fetch("https://ipinfo.io/json")
            data = await response.json();
        }catch (error) {
            ;
        }
        
        socket?.emit("createRoom", { 
            host: { name: username, avatar }, 
            room: { password, maxPlayers: max_players, maxRounds: max_rounds, language },
            IP: data
        });
       
        
    }

    // só adiciona 1 vez
        useEffect(() => {
        if (!socket) return;

        const handleRoomUpdate = () => {
            if (!in_game) setInGame(true);
        };

        socket.on("roomUpdate", handleRoomUpdate);

        return () => {
            socket.off("roomUpdate", handleRoomUpdate);
        };
        }, [socket, in_game, setInGame]);

    return(
        <div className="form_box create_room_box">
            <TextInput label="Password:" isPassword={true} placeholder="Create the room password" setText={setPassword} enterFunc={handleCreateRoom}/>

            <div className="number_inputs">
                <NumberInput label="Max Players:" placeholder="1 - 100" setNumber={setMaxPlayers} enterFunc={handleCreateRoom}/>
                <NumberInput label="Max Rounds:"  placeholder="1 - 50" setNumber={setMaxRounds} enterFunc={handleCreateRoom}/>
            </div>

            <div className="input_box" id="language_selection_box">
                <label id="languages_label">Language:</label>
                <div id="languages_icons_box">
                    <div id="PT-flag" 
                         className={`language_icon ${language === "PT" ? "flag-selected" : ""}`} 
                         onClick={() => setLanguage("PT")}/>
                    <div id="EN-flag" 
                         className={`language_icon ${language === "EN" ? "flag-selected" : ""}`} 
                         onClick={() => setLanguage("EN")}/>
                    <div id="SP-flag" 
                         className={`language_icon ${language === "SP" ? "flag-selected" : ""}`} 
                         onClick={() => setLanguage("SP")}/>
                </div>
            </div> 

            <Button text="Create room" func={handleCreateRoom} />
            {
                alert_active &&
                <div className="custom-alert">
                    {alert_message}
                </div>
            }
        </div>
    )
}

export default Create
