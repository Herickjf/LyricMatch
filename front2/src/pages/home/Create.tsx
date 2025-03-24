import TextInput from "../../utils/TextInput"
import Button from "../../utils/Button"
import NumberInput from "../../utils/NumberInput"
import "../../css/utils/form.css"
import "../../css/utils/input.css"

import { useState } from "react"

interface CreateProps {
    class?: string;
}

const Create: React.FC<CreateProps> = () => {
    const [password, setPassword] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number | string>(3);
    const [max_rounds, setMaxRounds] = useState<number | string>(3);
    const [language, setLanguage] = useState<"portuguese" | "english" | "spanish">("english");

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
                    <div className="language_icon" onClick={() => setLanguage("portuguese")}/>
                    <div className="language_icon" onClick={() => setLanguage("english")}/>
                    <div className="language_icon" onClick={() => setLanguage("spanish")}/>
                </div>
            </div>

            <Button text="Create room" func={() => console.log("Password: " + password, max_players, max_rounds, "Language: " + language)} />
        </div>
    )
}

export default Create