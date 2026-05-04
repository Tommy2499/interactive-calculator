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
const apostrophes = ["'", "’", "‘"];

/**
 * Converts time in HH:MM:SS format to total seconds.
 * @param {string} mark - The time mark (HH:MM:SS or MM:SS format).
 * @returns {number} Total seconds.
 */
function timeToSeconds(mark){
    let sections = mark.split(":");
    let seconds = Number(sections.at(-1));
    let minutes = Number(sections.at(-2));
    let totalSeconds = minutes * minToSec + seconds;
    if (sections.length > 2){
        let hours = Number(sections.at(-3));
        if (hours < 0) {
            return NaN;
        }
        totalSeconds += hours * hrToSec;
    }
    if (seconds < 0 || minutes < 0) { 
        return NaN;
    }
    return hundredths(totalSeconds);
}

function hundredths(num) {
    return Math.round(num * 100) / 100;
}

/**
 * Converts a feet + inches format (e.g. "6' 10\"") to meters.
 * @param {string} mark - Height or length string, possibly containing feet and inches.
 * @returns {number} Metric distance in meters.
 */
function feetToMeters(mark){
    mark = " " + mark + " ";
    let iIn = mark.indexOf("\"");
    let iFt = -1;
    for (const ap of apostrophes) {
        const index = mark.indexOf(ap);
        if (index !== -1) {
            iFt = index;
            break;
        }
    }
    let inches = 0;
    let feet = 0;
    let sections = mark.split(/['"’‘]/);

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
            inches = sections[0];
        }
    }
    else if (iFt != -1){
        feet = sections[0];
        inches = sections[1];
    }

    let meters = feet * ftToM + inches * inchToM;

    return meters;
}

/**
 * Parses strings that end with "m" or "cm" and returns distance in meters.
 * @param {string} mark - Metric notation (e.g. "5.50m" or "550cm").
 * @returns {number} Value in meters.
 */
function formatMetric(mark){
    if (mark.endsWith("cm")){
        mark = Number(mark.substring(0, mark.length - 2)) / 100;
    }
    else if (mark.endsWith("m")){
        mark = mark.substring(0, mark.length - 1);
    }
    return Number(mark);
}

/**
 * Determines which conversion method to use based on the format of the mark.
 * @param {string} mark - User-provided distance or time.
 * @returns {number} Numeric value in meters or seconds.
 */
function convMark(mark){
    if (mark.includes(":")){
        return timeToSeconds(mark);
    }
    else if (apostrophes.some(ap => mark.includes(ap)) || mark.includes("\"")){
        return feetToMeters(mark);
    }
    else if (mark.length > 1 && mark.endsWith("m")){
        return formatMetric(mark);
    }
    else{
        return hundredths(Number(mark));
    }
}

/**
 * Applies a polynomial expression to compute a points value.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {number} mark - Numeric mark (meters or seconds).
 * @returns {number} Calculated points.
 */
function pointFormula(coefficients, mark){
    let convFactor = coefficients[0];
    let resShift = coefficients[1];
    let ptShift = coefficients[2];

    // Old equation: round(convFactor * (mark + resShift)^2 + ptShift)
    // JS old: Math.round(convFactor * Math.pow(mark + resShift, 2) + ptShift)
    // New equation: round()
    let points = Math.round(convFactor * Math.pow(mark, 2) + resShift * mark + ptShift);
    return points;
}

/**
 * Retrieves the appropriate coefficients and calculates total points.
 * @param {string} season - "Indoor" or "Outdoor".
 * @param {string} gender - "men" or "women".
 * @param {string} event - The track/field event name.
 * @param {string} mark - String containing the mark to convert.
 * @returns {number|undefined} The final points value.
 */
function calcPoints(season, gender, event, mark){
    gender = gender.toLowerCase();
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

/**
 * Uses the quadratic formula to derive a mark from a given points value.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {number} points - Point score to solve for.
 * @returns {string} Mark in meters or seconds (as a string).
 */
function markFormula(coefficients, points){
    let convFactor = coefficients[0];
    let resShift = coefficients[1];
    let ptShift = coefficients[2];

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
    let mark = (Math.round(Math.min(Math.abs(-resShift - Math.sqrt(Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points))) / (2 * convFactor), Math.abs(-resShift + Math.sqrt(Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points))) / (2 * convFactor)) * 100) / 100).toFixed(2);
    return mark;
}

/**
 * Converts seconds to a formatted time string (SS.SS, MM:SS.SS, or H:MM:SS.SS).
 * @param {number} seconds - Time in seconds.
 * @returns {string} Formatted time string.
 */
function secondsToTime(seconds){

    seconds = Math.round(seconds * 100) / 100;
    if (seconds < 60) {
        return seconds.toFixed(2);
    }

    let hours = 0, minutes = 0;
    let result = ""

    if (seconds >= 3600) {
        hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        result = `${hours}:`
    } 
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds %= 60;
        if (hours > 0) {
            result += `${String(minutes).padStart(2, "0")}:`
        }
        else {
            result += `${minutes}:`
        }
    } 
    else if (hours){
        result += "00:"
    }

    result += String(seconds.toFixed(2)).padStart(5, "0")
    return result;
}

/**
 * Formats a numeric mark for display based on event type.
 * Running events are formatted as time (MM:SS.SS or H:MM:SS.SS).
 * Field events are formatted as distance (X.XXm).
 * @param {number} mark - Numeric mark value (meters or seconds).
 * @param {string} event - Event name to determine formatting type.
 * @returns {string} Formatted mark string.
 */
function formatMark(mark, event){
    const regex = /\d/;
    // Running event
    if (regex.test(event) || event.includes("Marathon")) {
        return secondsToTime(Number(mark));
    }
    // Multi event
    if (event.endsWith("athlon")) {
        return String(Math.round(mark));
    }
    // Field event
    return `${hundredths(mark).toFixed(2)}m`;
}

/**
 * Retrieves the appropriate coefficients and calculates a mark (time/distance).
 * @param {string} season - "Indoor" or "Outdoor".
 * @param {string} gender - "men" or "women".
 * @param {string} event - The track/field event name.
 * @param {string} points - The points to convert.
 * @returns {string|undefined} The final mark.
 */
function calcMark(season, gender, event, points){
    gender = gender.toLowerCase();
    points = Number(points);
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

/**
 * Validates user input for mark or points conversion.
 * @param {string} season - Selected season ("Indoor" or "Outdoor").
 * @param {string} gender - Selected gender ("Men" or "Women").
 * @param {string} event - Selected event name.
 * @param {string|number} input - User-entered mark or points value.
 * @param {boolean} isCalcPoints - True if calculating points, false if calculating mark.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function isValidEntry(season, gender, event, input, isCalcPoints){

    // TODO: Add selection validation for season, gender, and event

    // Check for null/empty inputs
    if (!season) {
        alertNull("season");
        return false;
    }
    if (!gender) {
        alertNull("gender");
        return false;
    }
    if (!event) {
        alertNull("event");
        return false;
    }
    if (input === "" || input === null || input === undefined) {
        alertNull(isCalcPoints ? "mark" : "points");
        return false;
    }

    // Validate points range (0–1400)
    const numInput = Number(input);
    if (!isCalcPoints && (Number.isNaN(numInput) || numInput < 0 || numInput > 1400)) {
        alertRange("Points", 0, 1400);
        return false;
    }

    return true;
}

/**
 * Alerts the user that a required input field is missing.
 * @param {string} label - The name of the missing field.
 */
function alertNull(label){
    alert(`Error. No input value for ${label}.`);
}

/**
 * Alerts the user that an input is outside the valid range.
 * @param {string} label - The name of the field with invalid range.
 * @param {number} start - Minimum valid value.
 * @param {number} end - Maximum valid value.
 */
function alertRange(label, start, end) {
    alert(`Error. ${label} must be between ${start} and ${end}.`)
}

/**
 * Main React component with input fields, calculators, and a history list.
 * @returns {JSX.Element} The rendered Trackulator UI.
 */
function Trackulator() {
  const [season, setSeason] = useState('Outdoor');
  const [gender, setGender] = useState('Men');
  const [event, setEvent] = useState('100m');
  const [mark, setMark] = useState('');
  const [dispMark, setDispMark] = useState('');
  const [points, setPoints] = useState('');
  const [history, setHistory] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  useEffect(() => {
    if (season && gender) {
      const events = Object.keys(eventMap[gender.toLowerCase()][season]);
      setEventOptions(events);
    }
  }, [season, gender]);

  // Saves the entered mark as points and updates history if valid
  const handleSavePoints = () => {
    if (!isValidEntry(season, gender, event, dispMark, true)) return;

    const convertedMark = convMark(dispMark);
    if (Number.isNaN(convertedMark) || convertedMark < 0) {
        alert(`Error. Invalid mark.`)
        return;
    }
    setMark(convertedMark)

    const formattedMark = formatMark(convertedMark, event);
    setDispMark(formattedMark);

    const calculatedPoints = calcPoints(season, gender, event, convertedMark);
    setPoints(calculatedPoints);
    if (calculatedPoints !== undefined) {
      // Add new result to the top of the list
      const newEntry = { season, gender, event, mark: formattedMark, points: calculatedPoints };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  // Converts points to a mark and updates history if valid
  const handleSaveMarks = () => {
    if (!isValidEntry(season, gender, event, points, false)) return;
    const formattedPoints = hundredths(points);
    setPoints(formattedPoints);

    const calculatedMark = calcMark(season, gender, event, formattedPoints);
    const formattedMark = formatMark(calculatedMark, event);
    setMark(calculatedMark);
    setDispMark(formattedMark);
    if (calculatedMark !== undefined) {
      // Add new result to the top of the list
      const newEntry = { season, gender, event, mark: formattedMark, points: formattedPoints };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  // Clears all entries in the history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    // Overall container for the Trackulator component
    <div className="trackulator-container">
        <TopMenu/>
        {/* Content area displaying input fields, results, and history */}
        <div className="trackulator-content">
            
        <h1>Trackulator</h1>
        <div className="sep-line"/>
        <div className='description'>
            <p>
                {/* Description of the Trackulator functionality */}
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
                    <input type="text" value={dispMark} onChange={(e) => setDispMark(e.target.value)} placeholder="Enter mark" />
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
