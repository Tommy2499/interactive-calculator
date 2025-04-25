import React, { useState, useEffect, Fragment } from 'react';
import './Trackulator.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import eventMap from './EventMap.json';
import coefficients2025 from './Coefficients2025.json'

const inchToM = 1 / 39.3700787402;
const ftToM = inchToM * 12;
const minToSec = 60;
const hrToSec = 3600;

function timeToSeconds(mark){
    let sections = mark.split(":");
    let seconds = Number(sections.at(-1));
    let minutes = Number(sections.at(-2));
    let totalSeconds = minutes * minToSec + seconds;
    if (sections.length > 2){
        let hours = Number(sections.at(-3));
        totalSeconds += hours * hrToSec;
    }
    return totalSeconds

}

/**
 * 
 * @param {string} mark 
 * @returns {number} meters
 */
function feetToMeters(mark){

    mark = " " + mark + " "
    let iIn = mark.indexOf("\"");
    let iFt = mark.indexOf("\'");
    let inches = 0;
    let feet = 0;
    let sections = mark.split(/['"]/);

    if (iIn != -1){
        if (iFt != -1){
            if (iFt < iIn){
                feet = sections[0];
                inches = sections[1];
            }
            else{
                feet = sections[1];
                inches = sections[0];
            }
        }
        else{
            inches = sections[0]
        }
    }
    else if (iFt != -1){
        feet = sections[0]
        inches = sections[1]
    }

    let meters = feet * ftToM + inches * inchToM

    return meters;
}

function formatMetric(mark){
    if (mark.endsWith("cm")){
        mark = Number(mark.substring(0, mark.length - 2)) / 100;
    }
    else if (mark.endsWith("m")){
        mark = mark.substring(0, mark.length - 1);
    }
    return Number(mark);
}

function convMark(mark){
    if (mark.includes(":")){
        return timeToSeconds(mark);
    }
    else if (mark.includes("\'") || mark.includes("\"")){
        return feetToMeters(mark);
    }
    else if (mark.endsWith("m")){
        return formatMetric(mark);
    }
    else{
        return Number(mark);
    }
}

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
 * @param {string} season 
 * @param {string} gender 
 * @param {string} event 
 * @param {string} mark 
 * @returns {Number} points
 */
function calcPoints(season, gender, event, mark){
    gender = gender.toLowerCase();
    mark = convMark(mark)
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

function markFormula(coefficients, points){
    let convFactor = coefficients[0]
    let resShift = coefficients[1]
    let ptShift = coefficients[2]

    // Point formula:
    // let points = Math.round(convFactor * Math.pow(mark, 2) + resShift * mark + ptShift)
    // Change points equation to solve for mark
    // We have  0 = ax^2 + bx + c
    // Where    a = convFactor
    //          b = resShift
    //          c = ptShift - points
    //          x = mark
    // Solve for x using quadratic formula
    //          x = (-b +- sqrt(b^2 - 4ac)) / 2a
    //          mark = (-resShift +- sqrt(resShift^2 - 4 * convFactor * (ptShift - points))) / (2 * convFactor)
    // Reformat for JavaScript and make compatible for scoring tables
    //          let mark = Math.round((-resShift + Math.sqrt(Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points))) / (2 * convFactor)).toFixed(2)
    let mark = (Math.round(Math.min(Math.abs(-resShift - Math.sqrt(Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points))) / (2 * convFactor), Math.abs(-resShift + Math.sqrt(Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points))) / (2 * convFactor)) * 100) / 100).toFixed(2)
    return mark;
}

function calcMark(season, gender, event, points){
    gender = gender.toLowerCase();
    points = Number(points)
    const params = [season, gender, event, points];
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
    let mark = markFormula(coefficients, points);
    return mark;
}

function Trackulator() {
  const [season, setSeason] = useState('Outdoor');
  const [gender, setGender] = useState('Men');
  const [event, setEvent] = useState('100m');
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

  const handleSavePoints = () => {
    const calculatedPoints = calcPoints(season, gender, event, mark);
    setPoints(calculatedPoints);
    if (calculatedPoints !== undefined) {
      const newEntry = { season, gender, event, mark, points: calculatedPoints };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  const handleSaveMarks = () => {
    const calculatedMark = calcMark(season, gender, event, points);
    setMark(calculatedMark);
    if (calculatedMark !== undefined) {
      const newEntry = { season, gender, event, mark: calculatedMark, points };
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
            <div className="sep-line"/>
            <div className='description'>
                <p>
                    This calculates a score based on how impressive
                    a certain time or distance is in a certain track
                    and field event. Conversely, it can calculate an
                    equivalent mark given a point score. The more
                    points a mark scores, the more impressive the mark
                    is. These points are calculated by polynomial
                    regression equations that correlate to World
                    Athletics scoring tables. These tables are only
                    intended to be accurate between 0 and 1400 points.
                </p>
            </div>
            <div className="sep-line"/>
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
                        <button onClick={handleSavePoints} className="save-button">Calculate Points</button>
                        <button onClick={handleSaveMarks} className="save-button">Calculate Mark</button>
                        <button onClick={handleClearHistory} className="save-button">Clear History</button>
                    </div>
                </div>
                <div className="sep-line"/>
                <div className="history-section">
                    <h2>History (Last 10 Entries)</h2>
                    <div className="history-container">
                        <div className="sep-line-sm"/>
                        <div className="header">
                            <div className="header-item">Season</div>
                            <div className="header-item">Gender</div>
                            <div className="header-item">Event</div>
                            <div className="header-item">Mark</div>
                            <div className="header-item">Points</div>
                        </div>
                        <div className="sep-line-sm"/>
                        <ul>
                        {history.map((entry, index) => (
                            <div key={index}>
                                <li>
                                    <div className="history-data">{entry.season}</div>
                                    <div className="history-data">{entry.gender}</div>
                                    <div className="history-data">{entry.event}</div>
                                    <div className="history-data">{entry.mark}</div>
                                    <div className="history-data">{entry.points}</div>
                                </li>
                                {history.length - 1 > index && <div className="sep-line-xs"/>}
                            </div>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <BottomMenu/>
    </div>
  );
}

export default Trackulator;
