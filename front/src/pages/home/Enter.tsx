import TextInput from '../../utils/TextInput'
import Button from '../../utils/Button'
import "../../css/utils/form.css"
import ErrorAlert from '../../utils/ErrorAlert'
import Notification from '../../utils/Notification'

import { useState } from 'react';


const Enter = () => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomPassword, setRoomPassword] = useState<string>("");

    return(
        <div className="form_box">
            <TextInput label="Code:" placeholder='Enter the room code' setText={setRoomCode}/>
            <TextInput label="Password:" placeholder='Enter the room password' setText={setRoomPassword}/>

            <Button 
                text="Enter room" 
                func={() => console.log("Code: " + roomCode, "Password: " + roomPassword)}
            />
            <ErrorAlert title="Error" message="This is a test error message" error_code={404}/>
            <Notification title="Success" message="This is a test success message"/>
        </div>
    )
}

export default Enter