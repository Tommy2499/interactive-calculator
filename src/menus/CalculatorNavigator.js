import React, { useState } from 'react';
import './CalculatorNavigator.css'
import { Link } from 'react-router-dom';

function CalculatorNavigator() {

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
        <div className='calc-nav-container'>
            <div className="nav-calculator-display">
                {hoveredTool}
            </div>

            {/* Navigator Grid */}
            <div className="calculator-navigator">
                {tools.map((tool, index) => (
                <Link
                    to={tool.path}
                    key={index}
                    className="nav-card"
                    onMouseEnter={() => setHoveredTool(tool.name)}
                    onMouseLeave={() => setHoveredTool("Select a Tool")}
                >
                    {tool.name}
                </Link>
                ))}
            </div>
        </div>
    );

}

export default CalculatorNavigator;