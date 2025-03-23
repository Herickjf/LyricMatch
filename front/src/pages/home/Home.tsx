import { useState } from 'react';
import '../../css/initialpages/home.css';

import Enter from './enter';
import Create from './create';
import TextInput from './TextInput';

const Home = () => {
    const [mode, setMode] = useState<"enter" | "create">("enter");

    function toggleToEnter() {
        setMode('enter');
    }

    function toggleToCreate() {
        setMode('create');
    }

    return(
        <div>
            <div id="form_box">
                <h1 id="game_title">Song Guesser</h1>


                <div id="options_entry_box">
                    <div id="enter_option"  className="option_entry" onClick={toggleToEnter} >Enter</div>
                    <div id="create_option" className="option_entry" onClick={toggleToCreate}>Create</div>
                </div>

                <div id="user_avatar_box">
                    <div id="edit_avatar_icon"></div>
                    <div id="user_avatar"></div>
                </div>
                
                {TextInput("Username:", "user_name")}

                {mode === "enter" && <Enter />}
                {mode === "create" && <Create />}

            </div>
        </div>
    )
}

export default Home