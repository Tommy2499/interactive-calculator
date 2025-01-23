import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as BasicCalculatorIcon } from './images/Basic-Calculator-Icon.svg';

function Home() {
  const sectionsRef = useRef([]); // Create a ref array for sections
  const [visibleSections, setVisibleSections] = useState([]); // Track visibility for each section

  useEffect(() => {
    const observers = sectionsRef.current.map((section, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [...new Set([...prev, index])]); // Mark section as visible
          }
        },
        { threshold: 0.1 } // Adjust as needed
      );

      if (section) observer.observe(section);
      return observer;
    });

    return () => {
      // Cleanup observers
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Scroll to the first calculator section
  const handleExploreClick = () => {
    if (sectionsRef.current[0]) {
      sectionsRef.current[0].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home">
      {/* Title Section */}
      <div className="home-box-1">
        <TopMenu />
        <div className="title-section">
          <div className="title">Welcome to Calc It!</div>
          <div className="subtitle">
            Your hub of calculators and tools to meet your needs. Select one of the options to get started!
          </div>
          <div className="explore" onClick={handleExploreClick}>Explore</div>
          <button className="explore-button" onClick={handleExploreClick}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>

      {/* Calculator Sections */}
      <div className="home-box-2" ref={(el) => (sectionsRef.current[0] = el)}>
        <div className="home-content">
          <div className="info-section">
            <h1>Basic Calculator</h1>
            <p>
              Click on the icon to the right to use our basic calculator. This computes basic addition, subtraction,
              multiplication, and division.
            </p>
          </div>
          <div
            className={`design-section icon-slide-in ${
              visibleSections.includes(0) ? 'icon-visible' : ''
            }`}
          >
            <Link to="/basic-calculator" className="icon-link">
              <BasicCalculatorIcon className="basic-icon" />
            </Link>
          </div>
        </div>
      </div>

      <div className="home-box-3" ref={(el) => (sectionsRef.current[1] = el)}>
        <div className="home-content">
          <div
            className={`design-section icon-slide-in-reverse ${
              visibleSections.includes(1) ? 'icon-visible' : ''
            }`}
          >
            <Link to="/basic-calculator" className="icon-link">
              <BasicCalculatorIcon className="basic-icon" />
            </Link>
          </div>
          <div className="info-section">
            <h1>Another Calculator</h1>
            <p>
              Click on the icon to the left to use another calculator. This solves advanced calculations.
            </p>
          </div>
        </div>
      </div>

      <BottomMenu />
    </div>
  );
}

export default Home;
