import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calculator from './BasicCalculator';
import DateDifference from './DateDifference';
import Trackulator from './Trackulator';
import Home from './Home';
import basename from './config';
import About from './About'

function App() {

  // Dynamically set the basename based on the environment

  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />}/>
          <Route path="/basic-calculator" element={<Calculator />} />
          <Route path="/date-difference" element={<DateDifference />} />
          <Route path="/trackulator" element={<Trackulator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
