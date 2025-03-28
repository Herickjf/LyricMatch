/*
    This module is responsible for containing the nav bar, 
    which contains the home screen menu icons (in the left corner) and the logo (in the right corner).
*/
// import {Link} from 'react-router-dom'

// import '../../css/initialpages/nav.css'
// import Menu from './Menu'


const Nav = () => {
    return(
        <div id = "nav_bar">
            <div className="nav_items" id="menu_icon" onClick={() => {console.log("Menu aberto")}}></div>
            <div className="nav_items" id="logo_icon"></div>
        </div>
    )
}


export default Nav