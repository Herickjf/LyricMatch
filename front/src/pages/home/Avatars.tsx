import '../../css/utils/avatars.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

interface AvatarsProps {
    setAvatarsOpenMenu: (value: boolean) => void;
    avatarOpenMenu: boolean;
    setAvatar: (value: string) => void;
}

const back_url = "http://localhost:4000";

const Avatars: React.FC<AvatarsProps> = ({setAvatar, avatarOpenMenu, setAvatarsOpenMenu}) => {
    const [avatars, setAvatars] = useState<any>([]);

    useEffect(() => {
        fetch(`${back_url}/images`)
            .then(response => response.json())
            .then(data => {
                setAvatars(data);
            });
    }, []);

    const selectAvatar = (avatar: string) => {
        setAvatar(avatar);
        setAvatarsOpenMenu(false);
    }

    return ReactDOM.createPortal(
        <div id='background_avatar_menu'
             style={{visibility: avatarOpenMenu ? "visible" : "hidden"}}>
            <div className="avatars_selection_box">
                <div id="avatar_menu_close" onClick={() => setAvatarsOpenMenu(false)}></div>
                <div id="avatar_menu_list">
                    {
                        avatars?.map((avatar: string, index: number) => (
                            <div key={index} 
                                className="avatar_item" 
                                onClick={() => selectAvatar(avatar)}
                                style={{backgroundImage: `url(${avatar})`}}
                            />
                        ))
                    }
                    
                </div>
            </div>
        </div>
        , document.body
    );
}

export default Avatars;