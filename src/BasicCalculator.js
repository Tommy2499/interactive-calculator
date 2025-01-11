import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import './App.css';
import './BasicCalculator.css'
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';

function BasicCalculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput(input + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleEvaluate = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <div className='basic-page'>
        <TopMenu/>
        <div className='basic-content'>
            <div className="device">
                <div className="display">
                    {input || '0'}
                </div>
                <div className="buttons">
                    <Button variant="secondary" onClick={() => handleClick('1')}>1</Button>
                    <Button variant="secondary" onClick={() => handleClick('2')}>2</Button>
                    <Button variant="secondary" onClick={() => handleClick('3')}>3</Button>
                    <Button variant="secondary" className="operation-btn" onClick={() => handleClick('+')}>+</Button>
                    <Button variant="secondary" onClick={() => handleClick('4')}>4</Button>
                    <Button variant="secondary" onClick={() => handleClick('5')}>5</Button>
                    <Button variant="secondary" onClick={() => handleClick('6')}>6</Button>
                    <Button variant="secondary" className="operation-btn" onClick={() => handleClick('-')}>–</Button>
                    <Button variant="secondary" onClick={() => handleClick('7')}>7</Button>
                    <Button variant="secondary" onClick={() => handleClick('8')}>8</Button>
                    <Button variant="secondary" onClick={() => handleClick('9')}>9</Button>
                    <Button variant="secondary" className="operation-btn" onClick={() => handleClick('*')}>×</Button>
                    <Button variant="secondary" onClick={handleClear}>C</Button>
                    <Button variant="secondary" onClick={() => handleClick('0')}>0</Button>
                    <Button variant="secondary" onClick={() => handleClick('.')}>.</Button>
                    <Button variant="secondary" className="operation-btn" onClick={() => handleClick('/')}>÷</Button>
                </div>
                <div className="bottom-row">
                    <Button variant="secondary" className="operation-btn" onClick={handleEvaluate}>=</Button>
                </div>
            </div>
        </div>
        <BottomMenu/>
    </div>
  );
}

export default BasicCalculator;
