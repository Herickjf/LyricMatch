// react imports

// components imports
import LeftBox from "./LeftBox"
import MidBox from "./MidBox"
import RightBox from "./RightBox"
import { SearchProvider } from "../../../utils/SearchContext"
// css imports
import "../../../css/game/desktop/desktopScreen.css"


const DesktopScreen: React.FC = () => {
    return(
        <div id="desktop_screen">
            <LeftBox/>
            <MidBox/>
            <RightBox/>
        </div>
    )
}

export default DesktopScreen;