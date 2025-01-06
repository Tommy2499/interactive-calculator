import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My Calculator App</h1>
      <p>Click the button below to access the calculator:</p>
      <Link to="/calculator">
        <button style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
          Go to Calculator
        </button>
      </Link>
    </div>
  );
}

export default Home;
