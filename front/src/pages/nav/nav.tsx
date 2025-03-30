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
        <nav >
            <div id = "nav_bar">
                <div className="nav_items" 
                     id="menu_icon" 
                     style={!menuOpen ? { visibility: "visible" }: { visibility: "hidden" }}
                     onClick={() => setMenuOpen(!menuOpen)}>
                </div>
                <div className="nav_items" id="logo_icon"></div>
            </div>

            {menuOpen && <Menu openMenu={menuOpen} setOpenMenu={setMenuOpen}/> }
        </nav>
    )
}


export default Nav