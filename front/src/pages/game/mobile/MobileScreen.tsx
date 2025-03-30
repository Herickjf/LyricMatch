interface MobileScreenProps {
    inheritance: (value: boolean) => void,
}

const MobileScreen: React.FC<MobileScreenProps> = ({inheritance}) => {
    return(
        <div>
            <h1>Mobile Screen</h1>
        </div>
    )
}

export default MobileScreen;