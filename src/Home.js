import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import CalculatorNavigator from './menus/CalculatorNavigator';
import BasicPreview from './previews/BasicPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './BasicCalculator.css'; // Include the CSS file
import { ReactComponent as BasicCalculatorIcon } from './images/Basic-Calculator-Icon.svg';



function Home() {

  const calculatorSectionRef = useRef(null); // Create a reference to the calculator section
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Check if the element is in view
        if (entry.isIntersecting) {
          setIsVisible(true); // Trigger the animation
        }
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    // Observe the icon element
    if (iconRef.current) {
      observer.observe(iconRef.current);
    };
    return () => {
      // Cleanup observer on unmount
      if (iconRef.current) {
        observer.unobserve(iconRef.current);
      }
    };
  }, []);

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
          <h1>Basic Calculator</h1>
          <p>
            Click on the icon to the right to use our basic calculator.
            This computes basic addition, subtraction, multiplication, and division.
          </p>
        </div>
        <div
          ref={iconRef}
          className={`design-section icon-slide-in ${isVisible ? 'icon-visible' : ''}`}
        >
          <Link to="/basic-calculator" className='icon-link'>
            <BasicCalculatorIcon className='basic-icon' />
          </Link>
        </div>
    </div>
      <BottomMenu />
    </div>
  );
}

export default Home;
