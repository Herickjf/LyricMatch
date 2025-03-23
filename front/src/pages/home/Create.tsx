import TextInput from "./TextInput"
import Button from "./Button"
import NumberInput from "./NumberInput"
import { useState } from "react"

const Create: React.FC = () => {
    const [password, setPassword] = useState<string>("")

    return(
        <div>
            {TextInput("Create Password", "create_user_name", setPassword)}
            {NumberInput("Max Players:", "create_max_players")}
            {NumberInput("Rounds:", "create_max_rounds")}
            <Button text="Create" func={() => console.log(password)} />
        </div>
    )
}

export default Create