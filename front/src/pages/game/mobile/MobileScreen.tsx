import React from "react";

import Chat from "./Chat";
import MainFrame from "./MainFrame";

import "../../../css/game/mobile/MobileScreen.css";

const MobileScreen: React.FC = () => {
    return(
        <div id="mobile_screen_box">
            {/* <div id="mobile_screen_logo_box"></div> */}
            <MainFrame/>
        </div>
    )
}

export default MobileScreen;