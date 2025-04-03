import '../css/utils/button.css';

interface ButtonProps {
    text: string;
    func: () => void;
    id?: string;
}

const Button: React.FC<ButtonProps> = ({ id, text, func }) => {
    return(
        <button id={id} className="button" onClick={func}>{text}</button>
    )
}

export default Button