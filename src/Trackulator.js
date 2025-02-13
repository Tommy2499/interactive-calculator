import React, { useState, useEffect } from 'react';
import './Trackulator.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import eventMap from './EventMap.json';
import coefficients2025 from './Coefficients2025.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

// TODO: Map inputs to stored values
// TODO: Calculate points
// TODO: Make UX intuitive

function pointFormula(coefficients, mark){
    let convFactor = coefficients[0]
    let resShift = coefficients[1]
    let ptShift = coefficients[2]

    // Old equation: round(convFactor * (mark + resShift)^2 + ptShift)
    // JS old: Math.round(convFactor * Math.pow(mark + resShift, 2) + ptShift)
    // New equation: round()
    let points = Math.round(convFactor * Math.pow(mark, 2) + resShift * mark + ptShift)
    return points;
}

/**
 * Calculates the point value of a mark in an event.
 * 
 * If season is indoor, look for event with "sh" (short track).
 * If there is no "sh", take first instance of event.
 * Extract coefficients from EventMap.json using gender, season, and event.
 * 
 * 
 * @param {*} season 
 * @param {*} gender 
 * @param {*} event 
 * @param {*} mark 
 */
function calcPoints(season, gender, event, mark){
    gender = gender.toLowerCase();
    mark = Number(mark)
    const params = [season, gender, event, mark];
    for (let param of params){
        if (!param){
            alert(`Error. No input value for ${param}`);
            return;
        }
    }
    let eventName = "";
    if (season === "Indoor"){
        eventName = eventMap[gender][season][event];
    }
    if (!eventName){
        season = "Outdoor";
        eventName = eventMap[gender][season][event];
    }
    const coefficients = coefficients2025[gender][eventName];
    let points = pointFormula(coefficients, mark);
    return points;
}

function Trackulator() {
  const [season, setSeason] = useState('Indoor');
  const [gender, setGender] = useState('Men');
  const [event, setEvent] = useState('');
  const [mark, setMark] = useState('');
  const [points, setPoints] = useState('');
  const [history, setHistory] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  useEffect(() => {
    if (season && gender) {
      const events = Object.keys(eventMap[gender.toLowerCase()][season]);
      setEventOptions(events);
    }
  }, [season, gender]);

  const handleSave = () => {
    const calculatedPoints = calcPoints(season, gender, event, mark);
    setPoints(calculatedPoints);
    if (calculatedPoints !== undefined) {
      const newEntry = { season, gender, event, mark, points: calculatedPoints };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="trackulator-container">
        <TopMenu/>
        <div className="trackulator-content">
            <h1>Trackulator</h1>
            <div className='input-history-body'>
                <div className='trackulator-inputs'>
                    <div className="input-group s">
                        <label>Season:</label>
                        <select value={season} onChange={(e) => setSeason(e.target.value)}>
                            <option value="Indoor">Indoor</option>
                            <option value="Outdoor">Outdoor</option>
                        </select>
                    </div>
                    
                    <div className="input-group s">
                        <label>Gender:</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                        </select>
                    </div>
                    
                    <div className="input-group s">
                        <label>Event:</label>
                        <select value={event} onChange={(e) => setEvent(e.target.value)}>
                          <option value="">Select event</option>
                          {eventOptions.map((eventOption, index) => (
                            <option key={index} value={eventOption}>{eventOption}</option>
                          ))}
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>Mark:</label>
                        <input type="text" value={mark} onChange={(e) => setMark(e.target.value)} placeholder="Enter mark" />
                    </div>
                    
                    <div className="input-group">
                        <label>Points:</label>
                        <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Enter points" />
                    </div>
                    <div className="executive-buttons">
                        <button onClick={handleSave} className="save-button">Calculate</button>
                        <button onClick={handleClearHistory} className="save-button">Clear History</button>
                    </div>
                </div>
                
                <div className="history-section">
                    <h2>History (Last 10 Entries)</h2>
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>
                                {entry.season} | {entry.gender} | {entry.event} | Mark: {entry.mark} | Points: {entry.points}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        <BottomMenu/>
    </div>
  );
}

export default Trackulator;
