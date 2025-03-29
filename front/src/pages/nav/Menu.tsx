interface MenuProps {
    openMenu: (open: boolean) => void;
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import '../../css/initialpages/nav.css';
import '../../css/utils/menu.css'; // Import the CSS file for the menu


const Menu : React.FC<MenuProps> = ({openMenu}) => {


    return ReactDOM.createPortal(
        <div id = "menu">
            <div id="menu_close_button" onClick={() => openMenu(false)}>x</div>

            <div id="menu_items_box">
                <Link className="menu_items" to="/"> Home </Link>
                <Link className="menu_items" to="/about"> About </Link>
                <Link className="menu_items" to="/howtoplay">How to Play</Link>
            </div>

            <div id="menu_return_button" onClick={() => openMenu(false)}/>

            <Link id="menu_dashboard_button" to="/dashboard">Dashboard</Link>
        </div>

        , document.body
    )
}

export default Menu