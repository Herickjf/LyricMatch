// react imports

// components imports
import LeftBox from "./LeftBox"
import MidBox from "./MidBox"
import RightBox from "./RightBox"
import { SearchProvider } from "../../../utils/SearchContext"

// css imports
import "../../../css/game/desktop/desktopScreen.css"

interface DesktopScreenProps {
    inheritance: (value: boolean) => void,
}

const DesktopScreen: React.FC<DesktopScreenProps> = ({inheritance}) => {
    return(
        <SearchProvider>
            <div id="desktop_screen">
                <LeftBox/>
                <MidBox/>
                <RightBox/>
            </div>
        </SearchProvider>
    )
}

export default DesktopScreen;