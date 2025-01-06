import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My Calculator App</h1>
      <p>Click the button below to access the calculator:</p>
      <Link to="/calculator">
        <Button style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
          Go to Calculator
        </Button>
      </Link>
    </div>
  );
}

export default Home;
