import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calculator from './BasicCalculator';
import Home from './Home';

function App() {
  return (
    <BrowserRouter basename='/'>
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
