import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import TopMenu from './TopMenu';
import BottomMenu from './BottomMenu';

function Home() {
  const [hoveredTool, setHoveredTool] = useState("Select a Tool");

  const tools = [
    { name: "Basic Calculator", path: "/basic-calculator" },
    { name: "Loan Calculator", path: "/loan-calculator" },
    { name: "BMI Calculator", path: "/bmi-calculator" },
    { name: "Currency Converter", path: "/currency-converter" },
    { name: "Unit Converter", path: "/unit-converter" },
    { name: "Date Difference", path: "/date-difference" },
    { name: "Percentage Calculator", path: "/percentage-calculator" },
    { name: "Investment Calculator", path: "/investment-calculator" },
    { name: "Scientific Calculator", path: "/scientific-calculator" },
  ];

  return (
    <div className="home">
      {/* Top Menu */}
      <TopMenu />

      <div className="home-content">
        {/* Left Section */}
        <div className="left-section">
          <h1>Welcome to My Calculator App</h1>
          <p>
            Explore a variety of calculators and tools to meet your needs. 
            Select one of the options to get started!
          </p>
        </div>

        {/* Right Section: Calculator-Inspired Navigator */}
        <div className="right-section">
          {/* Display Section */}
          <div className="calculator-display">
            {hoveredTool}
          </div>

          {/* Navigator Grid */}
          <div className="calculator-navigator">
            {tools.map((tool, index) => (
              <Link
                to={tool.path}
                key={index}
                className="card"
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool("Select a Tool")}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <BottomMenu />
    </div>
  );
}

export default Home;
