import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calculator from './BasicCalculator';
import Home from './Home';

function App() {

  // Dynamically set the basename based on the environment
  const basename =
    process.env.NODE_ENV === 'production' ? '/interactive-calculator' : '';

  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <Routes>
          {/* Define the route for the Home page */}
          <Route path="/" element={<Home />} />
          {/* Define the route for the Calculator page */}
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
