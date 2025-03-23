interface ButtonProps {
    text: string;
    func: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, func }) => {
    return(
        <button className="button" onClick={func}>{text}</button>
    )
}

export default Button