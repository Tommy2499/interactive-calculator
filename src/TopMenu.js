import React from 'react';
import './App.css'
import { Link } from 'react-router-dom';
import basename from './config.js';

function TopMenu() {

    return (
        <div className='top-menu-container'>
            <div className='left-top-menu'>
                <Link to={`${basename}/`}>Calc It</Link>
            </div>
            <div className='right-top-menu'>
                <Link to={`${basename}/`}>Calculators</Link>
                <div>About</div>
            </div>
        </div>
    );

}

export default TopMenu;