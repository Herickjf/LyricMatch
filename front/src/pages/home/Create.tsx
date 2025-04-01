import TextInput from "../../utils/TextInput"
import Button from "../../utils/Button"
import NumberInput from "../../utils/NumberInput"
import Alert from "../../utils/Alert"
import { useSocket } from "../../utils/SocketContext"
import { useRoomContext } from "../../utils/RoomContext"

import "../../css/utils/form.css"
import "../../css/utils/input.css"

import { useState } from "react"

interface CreateProps {
    username: string,
    avatar: number | string
}

const Create: React.FC<CreateProps> = ({username, avatar}) => {
    const [password, setPassword] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number>(3);
    const [max_rounds, setMaxRounds] = useState<number>(3);
    const [language, setLanguage] = useState<"PT" | "EN" | "SP">("EN");
    const [alert, setAlert] = useState<{title: string, message: string} | null>(null);
    const socket = useSocket();
    const { setRoom, setPlayers, setInGame, in_game } = useRoomContext();




    function handleCreateRoom() {
        if (username.length < 1) {
            setAlert({ title: "Input Error", message: "Please, set a username first." });
            return;
        }
        if (password.length < 1) {
            setAlert({ title: "Input Error", message: "Please, set a room password." });
            return;
        }
        if (max_players < 1 || max_players > 100) {
            setAlert({ title: "Input Error", message: "Please, set a valid number of players [1 - 100]." });
            return;
        }
        if (max_rounds < 1 || max_rounds > 50) {
            setAlert({ title: "Input Error", message: "Please, set a valid number of rounds [1 - 50]." });
            return;
        }

        socket?.emit("createRoom", { 
            host: { name: username, avatar }, 
            room: { password, maxPlayers: max_players, maxRounds: max_rounds, language } 
        });

       
        socket?.on("roomUpdate", (data) => {
            if(in_game) return;
            setRoom(data.room);
            setPlayers([{ name: username, avatar: avatar, isHost: true, score: 0 }]);
            setInGame(true);
        });
        

        socket?.on("error", (error) => {
            setAlert({ title: "Create Room Error", message: error.message });
        });
    }

    return(
        <div className="form_box">
            <TextInput label="Password:" placeholder="Create the room password" setText={setPassword}/>

            <div className="number_inputs">
                <NumberInput label="Max Players:" placeholder="3 - 100" setNumber={setMaxPlayers}/>
                <NumberInput label="Max Rounds:"  placeholder="3 - 50" setNumber={setMaxRounds}/>
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
            {alert && <Alert title={alert.title} message={alert.message} />}
        </div>
    )
}

export default Create