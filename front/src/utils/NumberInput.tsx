import "../css/utils/input.css"

interface NumberInput_Params{
    label: string,
    placeholder?: string,
    setNumber?: (num: number) => void, 
    enterFunc?: () => void
}

const NumberInput: React.FC<NumberInput_Params> = ({label, placeholder, setNumber, enterFunc}) =>{

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && enterFunc) {
            enterFunc();
        }
    }

    return(
        
        <div className="input_box" id="number_input_box">
            <label className="number_input_label">{label}</label>
            <input 
                type="number" 
                className="number_input"
                placeholder = {placeholder}
                onKeyDown={handleKeyDown}
                onChange= {(e) => setNumber && setNumber(Number(e.target.value))}
            />
        </div>

    )
}

export default NumberInput