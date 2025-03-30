import { useState } from 'react';

import Enter from './Enter';
import Create from './Create';
import Avatars from './Avatars';
import TextInput from '../../utils/TextInput';
import '../../css/initialpages/home.css';

interface HomeProps {
    inheritance: (value: boolean) => void;
}

const Home: React.FC<HomeProps> = ({inheritance}) => {
    const [mode, setMode] = useState<"enter" | "create">("enter");
    const [username, setUsername] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("http://localhost:4000/images/avatar1.png");
    const [openAvatarMenu, setOpenAvatarMenu] = useState<boolean>(false);

    function toggleToEnter() {
        setMode('enter');
    }

    function toggleToCreate() {
        setMode('create');
    }

    return(
        <div id='home'>
            <div id="form_box">
                <h1 id="game_title">Song Guesser</h1>


                <div id="options_entry_box">
                    <button 
                        style={mode === 'enter' ? {backgroundColor: '#A4AC86'}: undefined} 
                        id="enter_option"  
                        className="option_entry" 
                        onClick={toggleToEnter}  
                        >Enter
                    </button>
                    <button 
                        style={mode === 'create' ? {backgroundColor: '#A4AC86'}: undefined}
                        id="create_option" 
                        className="option_entry" 
                        onClick={toggleToCreate} 
                        >Create
                    </button>
                </div>

                <div id="user_avatar_box">
                    <div id="edit_avatar" onClick={() => setOpenAvatarMenu(true)}>
                        <div id="edit_avatar_icon"></div>
                    </div>
                    <div id="user_avatar" style={{backgroundImage: `url(${avatar})`}}></div>
                </div>
                
                <TextInput label="Nickname:" placeholder="Enter your nickname" setText={setUsername}/>


                {mode === "enter" && <Enter inheritance={inheritance} username={username}  avatar={avatar}/>}
                {mode === "create" && <Create inheritance={inheritance} username={username}  avatar={avatar}/>}
            </div>

            {openAvatarMenu && <Avatars setAvatarsOpenMenu={setOpenAvatarMenu} avatarOpenMenu={openAvatarMenu}  setAvatar={setAvatar}/> }
        </div>
    )
}

export default Home