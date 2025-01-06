import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './TopMenu'
import BottomMenu from './BottomMenu';

function Home() {
  return (
    <div className="home">
      <TopMenu></TopMenu>
      <div className='link-interface'>
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
      <BottomMenu></BottomMenu>
    </div>
  );
}

export default Home;
