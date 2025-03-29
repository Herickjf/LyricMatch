import TextInput from "../../utils/TextInput"
import Button from "../../utils/Button"
import NumberInput from "../../utils/NumberInput"
import Alert from "../../utils/Alert"
import { useSocket } from "../../utils/SocketContext"

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
    const [language, setLanguage] = useState<"PT" | "EN" | "ES">("EN");
    const [alert, setAlert] = useState<{title: string, message: string} | null>(null);
    const socket = useSocket();

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

        socket?.on("roomCreated", (data) => {
            console.log("Room created with code:", data.code);
            // Redirect to the room page or perform any other action
        });

        socket?.on("createError", (error) => {
            setAlert({ title: "Create Room Error", message: error.message });
        });
    }

    return(
        <div className="form_box">
            <TextInput label="Password:" placeholder="Create the room password" setText={setPassword}/>

            <div className="number_inputs">
                <NumberInput label="Max Players:" placeholder="3" setNumber={setMaxPlayers}/>
                <NumberInput label="Max Rounds:"  placeholder="3" setNumber={setMaxRounds}/>
            </div>

            <div className="input_box" id="language_select_box">
                <label id="languages_label">Language:</label>
                <div id="languages_icons_box">
                    <div className="language_icon" onClick={() => setLanguage("PT")}/>
                    <div className="language_icon" onClick={() => setLanguage("EN")}/>
                    <div className="language_icon" onClick={() => setLanguage("ES")}/>
                </div>
            </div>

            <Button text="Create room" func={handleCreateRoom} />
            {alert && <Alert title={alert.title} message={alert.message} />}
        </div>
    )
}

export default Create