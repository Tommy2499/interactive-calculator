import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import CalculatorNavigator from './menus/CalculatorNavigator';
import BasicPreview from './previews/BasicPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import BasicCalculatorIcon from './images/Basic-Calculator-Icon.svg';


function Home() {

  const calculatorSectionRef = useRef(null); // Create a reference to the calculator section

  // Scroll to the calculator section
  const handleExploreClick = () => {
    calculatorSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      <div className="home-box-1">
        <TopMenu />
        <div className="title-section">
          <div className='title'>Welcome to Calc It!</div>
          <div className='subtitle'>
            Your hub of of calculators and tools to meet your needs. 
            Select one of the options to get started!
          </div>
          <div className='explore' onClick={handleExploreClick}>Explore</div>
          <button className="explore-button" onClick={handleExploreClick}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>

      <div className="home-content" ref={calculatorSectionRef}>
        <div className="info-section">
          <h1>Welcome to My Calculator App</h1>
          <p>
            Explore a variety of calculators and tools to meet your needs. 
            Select one of the options to get started!
          </p>
        </div>
        <div className="design-section">
          <img src={BasicCalculatorIcon} className='basic-icon'></img>
        </div>
    </div>

        

      {/* Bottom Menu */}
      <BottomMenu />
    </div>
  );
}

export default Home;
