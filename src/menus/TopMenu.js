import React from 'react';
import './TopMenu.css'
import { Link } from 'react-router-dom';
import basename from '../config.js';

function TopMenu() {

    return (
        <div className='top-overall-container'>
            <div className='top-menu-container'>
                <div className='left-top-menu'>
                    <Link to={`/`} className="nav-link">Calc It</Link>
                </div>
                <div className='right-top-menu'>
                    <div>Calculators</div>
                    <div>About</div>
                </div>
            </div>
            <div className='border-line'/>
        </div>
    );

}

export default TopMenu;