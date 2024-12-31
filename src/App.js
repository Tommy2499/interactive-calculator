import React, { useState } from 'react';
import './App.css';  // Keep this for styling your app

function App() {
  const [input, setInput] = useState('');

  // Handle button click
  const handleClick = (value) => {
    setInput(input + value);
  };

  // Clear the display
  const handleClear = () => {
    setInput('');
  };

  // Evaluate the expression
  const handleEvaluate = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput('Error');
    }
  };

  return (
    <div className="App">
      <div className="display">{input}</div>
      <div className="buttons">
        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('0')}>0</button>
        <button onClick={() => handleClick('+')}>+</button>
        <button onClick={() => handleClick('-')}>-</button>
        <button onClick={() => handleClick('*')}>*</button>
        <button onClick={() => handleClick('/')}>/</button>
        <button onClick={handleClear}>C</button>
        <button onClick={handleEvaluate}>=</button>
      </div>
    </div>
  );
}

export default App;
