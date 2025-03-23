import TextInput from "../../utils/TextInput"
import Button from "../../utils/Button"
import NumberInput from "../../utils/NumberInput"

import { useState } from "react"

const Create: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [max_players, setMaxPlayers] = useState<number | string>(3);
    const [max_rounds, setMaxRounds] = useState<number | string>(3);
    const [language, setLanguage] = useState<"portuguese" | "english" | "spanish">("english");

    return(
        <div>
            <TextInput label="Create password:" placeholder="Create the room password" setText={setPassword}/>

            <div className="number_inputs">
                <NumberInput label="Max Players:" placeholder="3" setNumber={setMaxPlayers}/>
                <NumberInput label="Max Rounds:"  placeholder="3" setNumber={setMaxRounds}/>
            </div>

            <div id="language_select_box">
                <label id="languages_label">Languages:</label>
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