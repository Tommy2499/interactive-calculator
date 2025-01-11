import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import CalculatorNavigator from './menus/CalculatorNavigator';
import BasicPreview from './previews/BasicPreview';

function Home() {

  return (
    <div className="home">
      {/* Top Menu */}
      <TopMenu />

      <div className="home-content">
        {/* Left Section */}
        <div className="info-section">
          <h1>Welcome to My Calculator App</h1>
          <p>
            Explore a variety of calculators and tools to meet your needs. 
            Select one of the options to get started!
          </p>
        </div>

        {/* Right Section: Calculator-Inspired Navigator */}
        <div className="design-section">
          {/* Display Section */}
          <BasicPreview/>
        </div>
      </div>

      <div className="home-content">
        {/* Right Section: Calculator-Inspired Navigator */}
        <div className="design-section">
          {/* Display Section */}
          <CalculatorNavigator/>
        </div>
        {/* Left Section */}
        <div className="info-section">
          <h1>Welcome to My Calculator App</h1>
          <p>
            Explore a variety of calculators and tools to meet your needs. 
            Select one of the options to get started!
          </p>
        </div>
    </div>

        

      {/* Bottom Menu */}
      <BottomMenu />
    </div>
  );
}

export default Home;
