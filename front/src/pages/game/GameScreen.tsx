import React, { useState, useEffect } from 'react'
import useWindowSize from './ScreenSize'
import DesktopScreen from './desktop/DesktopScreen'
import MobileScreen from './mobile/MobileScreen'

interface GameScreenProps {
    inheritance: (value: boolean) => void,
}

const GameScreen: React.FC<GameScreenProps> = ({inheritance}) => {
    const { width } = useWindowSize();

    return (
        <div>
            {width < 1200 ? (
                <MobileScreen  inheritance={inheritance}/>
            ) : (
                <DesktopScreen inheritance={inheritance}/>
            )}
        </div>
    );
}

export default GameScreen;