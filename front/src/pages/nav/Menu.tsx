interface MenuProps {
    openMenu: boolean;
    setOpenMenu: (open: boolean) => void;
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../../css/initialpages/nav.css';
import '../../css/utils/menu.css'; // Import the CSS file for the menu


const Menu : React.FC<MenuProps> = ({openMenu, setOpenMenu}) => {


    return ReactDOM.createPortal(
        <div id = "menu">
            <div id="menu_close_button" onClick={() => setOpenMenu(!openMenu)}>x</div>

            <div id="menu_items_box">
                <Link className="menu_items" to="/"          onClick={() => setOpenMenu(!openMenu)}> Home </Link>
                <Link className="menu_items" to="/about"     onClick={() => setOpenMenu(!openMenu)}> About </Link>
                <Link className="menu_items" to="/howtoplay" onClick={() => setOpenMenu(!openMenu)}>How to Play</Link>
            </div>  

            <div id="menu_return_button" onClick={() => setOpenMenu(!openMenu)}/>

            <Link id="menu_dashboard_button" to="/dashboard" onClick={() => setOpenMenu(!openMenu)}>Dashboard</Link>
        </div>

        , document.body
    )
}

export default Menu