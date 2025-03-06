import React from 'react';
import './TopMenu.css';
import { Link } from 'react-router-dom';

function TopMenu() {
    return (
        <div className='top-overall-container'>
            <div className='top-menu-container'>
                <div className='left-top-menu'>
                    <Link to={`/`} className="nav-link">Calc It</Link>
                </div>
                <div className='right-top-menu'>
                    <div className='dropdown'>
                        <Link to={`/`} className='nav-link dropdown-title'>Calculators</Link>
                        <div className='dropdown-content'>
                            <Link to={`/basic-calculator`} className="dropdown-link" id="first-dropdown">Basic Calculator</Link>
                            <Link to={`/date-difference`} className="dropdown-link">Date Difference</Link>
                            <Link to={`/trackulator`} className="dropdown-link">Trackulator</Link>
                        </div>
                    </div>
                    <Link to={'/about'} className='nav-link'>About</Link>
                </div>
            </div>
            <div className='border-line'/>
        </div>
    );
}

export default TopMenu;