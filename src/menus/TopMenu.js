import React from 'react';
import './TopMenu.css'
import { Link } from 'react-router-dom';
import basename from '../config.js';

function TopMenu() {

    return (
        <div className='top-menu-container'>
            <div className='left-top-menu'>
                <Link to={`${basename}/`} className="nav-link">Calc It</Link>
            </div>
            <div className='right-top-menu'>
                <div>Calculators</div>
                <div>About</div>
            </div>
        </div>
    );

}

export default TopMenu;