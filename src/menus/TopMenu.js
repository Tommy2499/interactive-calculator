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
                        <div className='dropdown-title'>
                            <Link to={`/`} className='nav-link'>Calculators</Link>
                        </div>
                        <div className='dropdown-content'>
                            <Link to={`/basic-calculator`} className="dropdown-link" id="first-dropdown">Basic Calculator</Link>
                            <Link to={`/date-difference`} className="dropdown-link">Date Difference</Link>
                            <Link to={`/trackulator`} className="dropdown-link">Trackulator</Link>
                        </div>
                    </div>
                    <div>About</div>
                </div>
            </div>
            <div className='border-line'/>
        </div>
    );
}

export default TopMenu;