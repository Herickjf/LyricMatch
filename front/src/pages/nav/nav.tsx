/*
    This module is responsible for containing the nav bar, 
    which contains the home screen menu icons (in the left corner) and the logo (in the right corner).
*/
import React from 'react'

import '../../css/initialpages/nav.css'
import Menu from './Menu'
import { useState } from 'react'


interface menuProps {
    menuOpen: boolean,
    setMenuOpen: (open: boolean) => void
}

const Nav: React.FC<menuProps> = ({menuOpen, setMenuOpen}) => {
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

            <Menu openMenu={menuOpen} setOpenMenu={setMenuOpen}/>
        </nav>
    )
}


export default Nav