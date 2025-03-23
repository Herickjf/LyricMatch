const NumberInput = (label:string, id:string) =>{
    return(
        
        <div className="number_input_box">
            <label className="number_input_label">{label}</label>
            <input type="number" className="number_input" id={id}/>
        </div>

    )
}

export default NumberInput