interface MenuProps {
    openMenu: boolean;
    setOpenMenu: (open: boolean) => void;
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
// import '../../css/initialpages/nav.css';
import '../../css/utils/menu.css'; // Import the CSS file for the menu


const Menu : React.FC<MenuProps> = ({openMenu, setOpenMenu}) => {


    return ReactDOM.createPortal(
        <div id = "menu" className={openMenu ? "menu_opened" : "menu_closed"}>

            <div id="menu_items_box">
                <div id="menu_close_button" className='nav_items' onClick={() => setOpenMenu(!openMenu)}></div>
                <Link className="menu_item" to="/"          onClick={() => setOpenMenu(!openMenu)} >Home</Link>
                <Link className="menu_item" to="/about"     onClick={() => setOpenMenu(!openMenu)} >About us</Link>
                <Link className="menu_item" to="/aboutgame" onClick={() => setOpenMenu(!openMenu)} >About Game</Link>
            </div>  

            <div id="menu_return_button" onClick={() => setOpenMenu(!openMenu)}/>

            <div id="bottom_items">
                <Link className='menu_item' to="/dashboard" onClick={() => setOpenMenu(!openMenu)} >Dashboard</Link>
                <p>Version 3.0</p>
            </div>
        </div>

        , document.body
    )
}

export default Menu