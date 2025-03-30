import LeftBox from "./LeftBox"
import MidBox from "./MidBox"
import RightBox from "./RightBox"

interface DesktopScreenProps {
    inheritance: (value: boolean) => void,
}

const DesktopScreen: React.FC<DesktopScreenProps> = ({inheritance}) => {
    return(
        <div>
            <LeftBox/>
            <MidBox/>
            <RightBox/>
        </div>
    )
}

export default DesktopScreen;