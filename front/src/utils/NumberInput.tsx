import "../css/utils/input.css"

interface NumberInput_Params{
    label: string,
    placeholder?: string,
    setNumber?: (num: number|string) => void, 
}

const NumberInput: React.FC<NumberInput_Params> = ({label, placeholder, setNumber}) =>{
    return(
        
        <div className="input_box" id="number_input_box">
            <label className="number_input_label">{label}</label>
            <input 
                type="number" 
                className="number_input"
                placeholder = {placeholder}
                onChange= {(e) => setNumber && setNumber(e.target.value)}
            />
        </div>

    )
}

export default NumberInput