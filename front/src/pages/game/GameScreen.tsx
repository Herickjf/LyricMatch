// import React, { useState, useEffect } from 'react'
import useWindowSize from './ScreenSize'
import DesktopScreen from './desktop/DesktopScreen'
import MobileScreen from './mobile/MobileScreen'

import "../../css/game/gameScreen.css"


const GameScreen: React.FC = () => {
    const { width } = useWindowSize();

    return (
        <div id='game_screen'>
            {width < 1200 ? (
                <MobileScreen  />
            ) : (
                <DesktopScreen />
            )}
        </div>
    );
}

export default GameScreen;