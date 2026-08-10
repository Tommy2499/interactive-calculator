import React, { useState, useEffect } from 'react';
import './Trackulator.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';
import eventMap from './EventMap.json';
import eventAttributes from './EventAttributes.json';
import coefficients2025 from './Coefficients2025.json'

const inchToM = 1 / 39.3700787402;
const ftToM = inchToM * 12;
const minToSec = 60;
const hrToSec = 3600;
const apostrophes = ["'", "`", "\u00B4", "\u02BC", "\u2018", "\u2019", "\u201B", "\u2032", "\u2035", "\uFF07"];
const quotationMarks = ["\"", "\u201C", "\u201D", "\u201E", "\u201F", "\u2033", "\u2036", "\uFF02"];
const imperialDelimiters = new RegExp(`[${apostrophes.join("")}${quotationMarks.join("")}]`);
const defaultMarkPrecision = 100;
const pointMarkPrecision = 1;
const roundingTolerance = 1e-9;

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

/**
 * Rounds a number to two decimal places.
 * @param {number|string} num - Number to round.
 * @returns {number} Number rounded to the nearest hundredth.
 */
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
    let iIn = -1;
    let iFt = -1;
    for (const quote of quotationMarks) {
        const index = mark.indexOf(quote);
        if (index !== -1) {
            iIn = index;
            break;
        }
    }
    for (const ap of apostrophes) {
        const index = mark.indexOf(ap);
        if (index !== -1) {
            iFt = index;
            break;
        }
    }
    let inches = 0;
    let feet = 0;
    let sections = mark.split(imperialDelimiters);

    if (iIn !== -1){
        if (iFt !== -1){
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
    else if (iFt !== -1){
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
 * Checks whether a mark contains feet or inches notation.
 * @param {string} mark - User-provided mark.
 * @returns {boolean} True if the mark uses imperial notation.
 */
function hasImperialNotation(mark) {
    return apostrophes.some(ap => mark.includes(ap)) || quotationMarks.some(quote => mark.includes(quote));
}

/**
 * Converts a time mark to seconds.
 * @param {string} mark - User-provided time or raw seconds.
 * @returns {number} Time in seconds, or NaN for invalid input.
 */
function parseTimeMark(mark) {
    if (mark.includes(":")) {
        return timeToSeconds(mark);
    }
    return hundredths(Number(mark));
}

/**
 * Converts a distance mark to meters.
 * @param {string} mark - User-provided metric, imperial, or raw meter distance.
 * @returns {number} Distance in meters, or NaN for invalid input.
 */
function parseDistanceMark(mark) {
    if (hasImperialNotation(mark)) {
        return feetToMeters(mark);
    }
    if (mark.length > 1 && mark.endsWith("m")) {
        return formatMetric(mark);
    }
    return hundredths(Number(mark));
}

/**
 * Converts a multi-event mark to whole points.
 * @param {string} mark - User-provided multi-event point total.
 * @returns {number} Rounded point total, or NaN for invalid input.
 */
function parsePointsMark(mark) {
    return Math.round(Number(mark));
}

/**
 * Rounds a converted mark to the precision users can re-enter.
 * @param {number} mark - Converted mark value.
 * @param {{resultFormat: string}} attributes - Selected event attributes.
 * @returns {number} Mark rounded to the event's input precision.
 */
function roundMarkToPrecision(mark, attributes) {
    const precision = getMarkPrecision(attributes);
    return Math.round(mark * precision) / precision;
}

/**
 * Converts a mark using the selected event's result format.
 * @param {string} mark - User-provided mark.
 * @param {string} event - Selected event name.
 * @returns {number} Converted mark in seconds, meters, or points.
 */
function convMark(mark, event) {
    const attributes = eventAttributes[event];
    if (!attributes) return NaN;
    let convertedMark = NaN;

    if (attributes.resultFormat === "time") {
        convertedMark = parseTimeMark(mark);
    }
    else if (attributes.resultFormat === "distance") {
        convertedMark = parseDistanceMark(mark);
    }
    else if (attributes.resultFormat === "points") {
        convertedMark = parsePointsMark(mark);
    }

    if (Number.isNaN(convertedMark)) {
        return NaN;
    }
    return roundMarkToPrecision(convertedMark, attributes);
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
 * Looks up the coefficient-table event key for a selected event.
 * @param {string} season - Selected season ("Indoor" or "Outdoor").
 * @param {string} gender - Selected gender ("Men" or "Women").
 * @param {string} event - Selected event name.
 * @returns {string|undefined} Coefficient-table event key.
 */
function getEventName(season, gender, event) {
    return eventMap[gender.toLowerCase()]?.[season]?.[event];
}

/**
 * Sorts event names by their configured sort value.
 * @param {string[]} events - Event names to sort.
 * @returns {string[]} Sorted event names.
 */
function sortEventsByAttributes(events) {
    return [...events].sort((eventA, eventB) => {
        const sortA = eventAttributes[eventA]?.sortValue ?? Number.MAX_SAFE_INTEGER;
        const sortB = eventAttributes[eventB]?.sortValue ?? Number.MAX_SAFE_INTEGER;
        return sortA - sortB || eventA.localeCompare(eventB);
    });
}

/**
 * Retrieves the coefficient array for a selected event.
 * @param {string} season - Selected season ("Indoor" or "Outdoor").
 * @param {string} gender - Selected gender ("Men" or "Women").
 * @param {string} event - Selected event name.
 * @returns {number[]|undefined} Coefficient array for the selected event.
 */
function getCoefficients(season, gender, event) {
    gender = gender.toLowerCase();
    const eventName = getEventName(season, gender, event);
    if (!eventName) return undefined;

    return coefficients2025[gender][eventName];
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
    const coefficients = getCoefficients(season, gender, event);
    if (!coefficients) return undefined;

    let points = pointFormula(coefficients, mark);
    return points;
}

/**
 * Uses the quadratic formula to derive an unrounded mark from a points value.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {number} points - Point score to solve for.
 * @returns {number} Unrounded mark in meters, seconds, or points.
 */
function markFormulaRaw(coefficients, points) {
    let convFactor = coefficients[0];
    let resShift = coefficients[1];
    let ptShift = coefficients[2];
    const discriminant = Math.pow(resShift, 2) - 4 * convFactor * (ptShift - points);

    if (discriminant < 0) {
        const vertex = vertexFormula(coefficients);
        return pointFormula(coefficients, vertex) === Math.round(points) ? vertex : NaN;
    }

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
    let mark = Math.min(Math.abs(-resShift - Math.sqrt(discriminant)) / (2 * convFactor), Math.abs(-resShift + Math.sqrt(discriminant)) / (2 * convFactor));
    return mark;
}

/**
 * Uses the quadratic formula to derive a mark from a given points value.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {number} points - Point score to solve for.
 * @returns {string} Mark in meters or seconds (as a string).
 */
function markFormula(coefficients, points){
    return hundredths(markFormulaRaw(coefficients, points)).toFixed(2);
}

/**
 * Finds the mark where the event's scoring curve changes direction.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @returns {number} Vertex mark value.
 */
function vertexFormula(coefficients) {
    // x value of vertex of a quadratic: -b / (2a)
    const convFactor = coefficients[0];
    const resShift = coefficients[1];
    return -resShift / (2 * convFactor);
}

/**
 * Gets the display/input precision for a converted mark.
 * @param {{resultFormat: string}} attributes - Selected event attributes.
 * @returns {number} Number of accepted input units per whole mark.
 */
function getMarkPrecision(attributes) {
    return attributes.resultFormat === "points" ? pointMarkPrecision : defaultMarkPrecision;
}

/**
 * Rounds a mark up to the nearest displayable input unit.
 * @param {number} mark - Raw mark boundary.
 * @param {number} precision - Number of accepted input units per whole mark.
 * @returns {number} Mark rounded up to the nearest displayable input unit.
 */
function ceilMark(mark, precision) {
    return Math.ceil((mark - roundingTolerance) * precision) / precision;
}

/**
 * Rounds a mark down to the nearest displayable input unit.
 * @param {number} mark - Raw mark boundary.
 * @param {number} precision - Number of accepted input units per whole mark.
 * @returns {number} Mark rounded down to the nearest displayable input unit.
 */
function floorMark(mark, precision) {
    return Math.floor((mark + roundingTolerance) * precision) / precision;
}

/**
 * Checks whether a converted mark stays within the scored branch and 0–1400
 * rounded point range.
 * @param {number} mark - Converted mark value.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {{resultFormat: string}} attributes - Selected event attributes.
 * @param {{min: number, max: number}} range - Exact accepted mark range.
 * @returns {boolean} True if the mark is accepted by the scoring table.
 */
function isAcceptedMark(mark, coefficients, attributes, range) {
    const points = pointFormula(coefficients, mark);
    return (
        points >= 0 &&
        points <= 1400 &&
        mark >= range.min &&
        mark <= range.max &&
        Boolean(attributes.resultFormat)
    );
}

/**
 * Moves a display boundary inward until it is accepted by the scoring table.
 * @param {number} mark - Displayable mark boundary.
 * @param {number} direction - Direction to move by one displayable input unit.
 * @param {number} precision - Number of accepted input units per whole mark.
 * @param {number[]} coefficients - [convFactor, resShift, ptShift].
 * @param {{resultFormat: string}} attributes - Selected event attributes.
 * @param {{min: number, max: number}} range - Exact accepted mark range.
 * @returns {number} Nearest accepted displayable mark.
 */
function adjustToAcceptedMark(mark, direction, precision, coefficients, attributes, range) {
    while (!isAcceptedMark(mark, coefficients, attributes, range)) {
        mark = Math.round((mark + direction / precision) * precision) / precision;
    }
    return mark;
}

/**
 * Gets the practical mark range for the selected event's 0–1400 point table.
 * @param {string} season - Selected season ("Indoor" or "Outdoor").
 * @param {string} gender - Selected gender ("Men" or "Women").
 * @param {string} event - Selected event name.
 * @returns {{min: number, max: number, displayMin: number, displayMax: number}|undefined} Accepted converted mark range.
 */
function getValidMarkRange(season, gender, event) {
    const coefficients = getCoefficients(season, gender, event);
    const attributes = eventAttributes[event];
    if (!coefficients || !attributes) return undefined;

    const vertex = vertexFormula(coefficients);
    const highBoundaryMark = markFormulaRaw(coefficients, 1400.5);
    const precision = getMarkPrecision(attributes);

    if (attributes.resultFormat === "time") {
        const range = {
            min: highBoundaryMark,
            max: vertex
        };
        return {
            ...range,
            displayMin: adjustToAcceptedMark(ceilMark(range.min, precision), 1, precision, coefficients, attributes, range),
            displayMax: adjustToAcceptedMark(floorMark(range.max, precision), -1, precision, coefficients, attributes, range)
        };
    }

    const range = {
        min: Math.max(0, vertex),
        max: highBoundaryMark
    };
    return {
        ...range,
        displayMin: adjustToAcceptedMark(ceilMark(range.min, precision), 1, precision, coefficients, attributes, range),
        displayMax: adjustToAcceptedMark(floorMark(range.max, precision), -1, precision, coefficients, attributes, range)
    };
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
 * Formats a numeric mark for display based on the event result format.
 * Time events are formatted as time, multi events as whole points, and field
 * events as meters.
 * @param {number} mark - Numeric mark value (meters or seconds).
 * @param {string} event - Event name to determine formatting type.
 * @returns {string} Formatted mark string.
 */
function formatMark(mark, event){
    const attributes = eventAttributes[event];
    // Timed event
    if (attributes?.resultFormat === "time") {
        return secondsToTime(Number(mark));
    }
    // Multi event
    if (attributes?.resultFormat === "points") {
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
    points = Number(points);
    const coefficients = getCoefficients(season, gender, event);
    if (!coefficients) return undefined;

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
    if (!getEventName(season, gender, event)) {
        alert(`Error. ${event} is not available for ${gender} ${season}.`);
        return false;
    }
    if (!eventAttributes[event]) {
        alert(`Error. No attributes found for ${event}.`);
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
 * Alerts the user that a mark is outside the accepted scoring range.
 * @param {number} minMark - Minimum accepted display mark.
 * @param {number} maxMark - Maximum accepted display mark.
 * @param {string} event - Selected event name.
 */
function alertMarkRange(minMark, maxMark, event) {
    alertRange("Mark", formatMark(minMark, event), formatMark(maxMark, event));
}

/**
 * Formats season and gender for the mobile history context.
 * @param {string} season - Selected season.
 * @param {string} gender - Selected gender.
 * @returns {string} Compact context label.
 */
function formatHistoryContext(season, gender) {
    return `${season} • ${gender}`;
}

/**
 * Main React component with input fields, calculators, and a history list.
 * @returns {JSX.Element} The rendered Trackulator UI.
 */
function Trackulator() {
  const [season, setSeason] = useState('Outdoor');
  const [gender, setGender] = useState('Men');
  const [event, setEvent] = useState('100m');
  const [dispMark, setDispMark] = useState('');
  const [points, setPoints] = useState('');
  const [history, setHistory] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  useEffect(() => {
    if (season && gender) {
      const events = sortEventsByAttributes(Object.keys(eventMap[gender.toLowerCase()][season]));
      setEventOptions(events);
      if (!events.includes(event)) {
        setEvent(events[0] || '');
      }
    }
  }, [season, gender, event]);

  /**
   * Saves the entered mark as points and updates history if valid.
   */
  const handleSavePoints = () => {
    if (!isValidEntry(season, gender, event, dispMark, true)) return;

    const convertedMark = convMark(dispMark, event);
    if (Number.isNaN(convertedMark)) {
        alert(`Error. Invalid mark.`)
        return;
    }

    const range = getValidMarkRange(season, gender, event);
    if (!range) {
        alert(`Error. ${event} is not available for ${gender} ${season}.`)
        return;
    }

    const formattedMark = formatMark(convertedMark, event);

    const calculatedPoints = calcPoints(season, gender, event, convertedMark);
    if (calculatedPoints === undefined) {
        alert(`Error. ${event} is not available for ${gender} ${season}.`)
        return;
    }
    if (
        calculatedPoints < 0 ||
        calculatedPoints > 1400 ||
        convertedMark < range.min ||
        convertedMark > range.max
    ) {
        alertMarkRange(range.displayMin, range.displayMax, event);
        return;
    }

    setDispMark(formattedMark);
    setPoints(calculatedPoints);
    // Add new result to the top of the list
    const newEntry = { season, gender, event, mark: formattedMark, points: calculatedPoints };
    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  /**
   * Converts points to a mark and updates history if valid.
   */
  const handleSaveMarks = () => {
    if (!isValidEntry(season, gender, event, points, false)) return;
    const formattedPoints = hundredths(points);
    setPoints(formattedPoints);

    const calculatedMark = calcMark(season, gender, event, formattedPoints);
    if (calculatedMark === undefined) {
        alert(`Error. ${event} is not available for ${gender} ${season}.`)
        return;
    }

    const formattedMark = formatMark(calculatedMark, event);
    setDispMark(formattedMark);
    // Add new result to the top of the list
    const newEntry = { season, gender, event, mark: formattedMark, points: formattedPoints };
    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  /**
   * Clears all entries in the history.
   */
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
                        
                        <div className="header-item history-season">Season</div>
                        <div className="header-item history-gender">Gender</div>
                        <div className="header-item history-event">Event</div>
                        <div className="header-item history-mark">Mark</div>
                        <div className="header-item history-points">Points</div>
                        <div className="header-item history-context">Context</div>
                    </div>
                    <div className="sep-line-sm"/>
                    <ul>
                    {history.map((entry, index) => (
                        <div key={index}>
                            <li className={`history-entry history-${entry.gender.toLowerCase()}`}>
                                <div className="history-data history-season">{entry.season}</div>
                                <div className="history-data history-gender">{entry.gender}</div>
                                <div className="history-data history-event" title={entry.event}>{entry.event}</div>
                                <div className="history-data history-mark">{entry.mark}</div>
                                <div className="history-data history-points">{entry.points}</div>
                                <div
                                    className="history-data history-context"
                                    title={`${entry.season} ${entry.gender}`}
                                    aria-label={`${entry.season} ${entry.gender}`}
                                >
                                    {formatHistoryContext(entry.season, entry.gender)}
                                </div>
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
