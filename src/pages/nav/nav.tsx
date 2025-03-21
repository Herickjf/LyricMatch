/*
    This module is responsible for containing the nav bar, 
    which contains the home screen menu icons (in the left corner) and the logo (in the right corner).
*/
import {Link} from 'react-router-dom'

import '../../css/initialpages/nav.css'


const Nav = () => {
    return(
        <div id = "nav_bar">
            <div className="nav_items" id="menu_icon"></div>
            <div className="nav_items" id="logo_icon"></div>

            {/* <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav> */}
        </div>
    )
}


export default Nav