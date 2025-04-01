import "../css/utils/input.css"

interface TextInput_Params{
    label: string,
    placeholder?: string,
    value?: string,
    setText?: (text: string) => void
}

const TextInput : React.FC<TextInput_Params> = ({label, placeholder, setText, value}) =>{
    return(
        <div className="input_box" id="text_input_box">
            <label className="text_input_label">{label}</label>
            <input  type="text" 
                    className="text_input"
                    onChange={(e) => setText && setText(e.target.value)} 
                    placeholder = {placeholder}
                    // autoComplete="off"
                    value={value}
            />
        </div>
    )
}

export default TextInput