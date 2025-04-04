import "../css/utils/Alert.css"

interface AlertProps {
    title: string, 
    message: string,
    error_code?: number | string,
    seconds?: number
}

import React from 'react';
import ReactDOM from 'react-dom';

const Alert : React.FC<AlertProps> = ({title, message, error_code, seconds = 3}) => {
    const [visible, setVisible] = React.useState(true);
    const [timebar, setTimeBar] = React.useState(100);


    React.useEffect(() => {
        setVisible(true);
        setTimeBar(100);
        const interval = 10; 
        const step = 100 / (seconds * 1000 / interval);

        const timer = setInterval(() => {
            setTimeBar((prev) => Math.max(prev - step, 0));
        }, interval);

        const hideTimer = setTimeout(() => {
            handleClose();
            clearInterval(timer);
        }, seconds * 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(hideTimer);
        };
    }, [title, message, seconds]);


    function handleClose() {
        title = "";
        message = "";
        setVisible(false);
    }

    return ReactDOM.createPortal(
        <div className = "alert" role = "alert" style={{visibility: visible ? "visible" : "hidden"}}>
            <div className="alert_close_button" onClick={handleClose}></div>
            {error_code ? (
                <div className="alert_title">Error <span className="alert_error_code">{error_code}</span>: {title}</div>
            ) : (
                <div className="alert_title">{title}</div>
            )}
            <div className="alert_message">{message}</div>
            <div className="alert_time_bar" style={{width: `${timebar}%`}}></div>

        </div>
        
        , document.body
    )
}

export default Alert