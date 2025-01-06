import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My Calculator App</h1>
      <p>Click the button below to access the calculator:</p>
      <div className='link-container'>
        <Link to="/calculator">
            <Button className='calc-link'>
                Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
                Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
                Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
        <Link to="/calculator">
            <Button className='calc-link'>
            Go to Calculator
            </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
