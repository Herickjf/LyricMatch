// react imports

// components imports
import LeftBox from "./LeftBox"
import MidBox from "./MidBox"
import RightBox from "./RightBox"

// css imports
import "../../../css/game/desktop/desktopScreen.css"

interface DesktopScreenProps {
    inheritance: (value: boolean) => void,
}

const DesktopScreen: React.FC<DesktopScreenProps> = ({inheritance}) => {
    return(
        <div id="desktop_screen">
            <LeftBox/>
            <MidBox/>
            <RightBox/>
        </div>
    )
}

export default DesktopScreen;