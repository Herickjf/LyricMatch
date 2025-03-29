/*
    This module is responsible for containing the nav bar, 
    which contains the home screen menu icons (in the left corner) and the logo (in the right corner).
*/
import React from 'react'
import ReactDOM from 'react-dom';

import '../../css/initialpages/nav.css'
import Menu from './Menu'
import { useState } from 'react'


const Nav: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div id = "nav_bar">
            <div className="nav_items" id="menu_icon" onClick={() => setMenuOpen(true)}></div>
            <div className="nav_items" id="logo_icon"></div>
            {menuOpen && <Menu openMenu={setMenuOpen}/> }
        </div>
    )
}


export default Nav