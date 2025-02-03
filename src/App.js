import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calculator from './BasicCalculator';
import DateDifference from './DateDifference';
import Trackulator from './Trackulator';
import Home from './Home';
import basename from './config';

function App() {

  // Dynamically set the basename based on the environment

  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <Routes>
          {/* Define the route for the Home page */}
          <Route path="/" element={<Home />} />
          {/* Define the route for the Calculator page */}
          <Route path="/basic-calculator" element={<Calculator />} />
          <Route path="/date-difference" element={<DateDifference />} />
          <Route path="/trackulator" element={<Trackulator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
