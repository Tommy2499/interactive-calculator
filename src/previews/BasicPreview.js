import React from 'react';
import Link from 'react-router-dom';
import './BasicPreview.css';

function BasicPreview() {
    return (
        <div className='basic-prev-container'>
            <div className='calculator-display'>Basic Calculator</div>
            <div className='calculator-body'>
                <div className='card'>+</div>
                <div className='card'>–</div>
                <div className='card'>×</div>
                <div className='card'>÷</div>
            </div>
        </div>
    );
}

export default BasicPreview;