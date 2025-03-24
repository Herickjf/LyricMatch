import TextInput from '../../utils/TextInput'
import Button from '../../utils/Button'
import "../../css/utils/form.css"

import { useState } from 'react';


const Enter = () => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomPassword, setRoomPassword] = useState<string>("");

    return(
        <div className="form_box">
            <TextInput label="Code:" placeholder='Enter the room code' setText={setRoomCode}/>
            <TextInput label="Password:" placeholder='Enter the room password' setText={setRoomPassword}/>

            <Button text="Enter room" func={() => console.log("Code: " + roomCode, "Password: " + roomPassword)} />
        </div>
    )
}

export default Enter