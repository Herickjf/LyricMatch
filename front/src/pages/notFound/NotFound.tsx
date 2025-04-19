interface NotFoundProps {
    closeMenu: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({closeMenu}) => {
    return(
        <div onClick={closeMenu}>
            Not Found
        </div>
    )
}

export default NotFound