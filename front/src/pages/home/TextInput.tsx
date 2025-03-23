const TextInput = (label:string, id:string, text_change?: (text: string) => void) =>{
    return(
        <div className="text_input_box">
            <label className="text_input_label">{label}</label>
            <input type="text" className="text_input" id={id} onChange={(e) => text_change && text_change(e.target.value)}/>
        </div>


    )
}

export default TextInput