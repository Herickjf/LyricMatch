import TextInput from './TextInput'
import Button from './Button'

const Enter = () => {
    return(
        <div>
            {TextInput("Room Code:", "enter_room_code")}
            {TextInput("Password:", "enter_password")}
            <Button text="Enter" func={() => console.log("Enter")} />
        </div>
    )
}

export default Enter