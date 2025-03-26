interface NotificationProps {
    title: string, 
    message: string,
    seconds?: number
}

import React from 'react';
import ReactDOM from 'react-dom';

const Notification : React.FC<NotificationProps> = ({title, message, seconds = 2}) => {
    const [visible, setVisible] = React.useState(true);
    const [timebar, setTimeBar] = React.useState(100);

    React.useEffect(() => {
        const interval = 10; // Atualização a cada 10ms para suavidade
        const step = 100 / (seconds * 1000 / interval);

        const timer = setInterval(() => {
            setTimeBar((prev) => Math.max(prev - step, 0));
        }, interval);

        const hideTimer = setTimeout(() => {
            setVisible(false);
            clearInterval(timer);
        }, seconds * 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(hideTimer);
        };
    }, [seconds]);

    if (!visible) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className = "notification" role = "alert">
            <div className="notification_close_button"></div>
            <div className="notification_title">{title}</div>
            <div className="notification_message">{message}</div>
            <div className="notification_time_bar" style={{width: `${timebar}%`}}></div>

        </div>
        
        , document.body
    )
}

export default Notification;