import React, { useState } from 'react';
import './Trackulator.css';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';

// TODO: Map inputs to stored values
// TODO: Calculate points
// TODO: Make UX intuitive

/**
 * Calculates the point value of a mark in an event.
 * 
 * If season is indoor, look for event with "sh" (short track).
 * If there is no "sh", take first instance of event.
 * 
 * 
 * @param {*} season 
 * @param {*} gender 
 * @param {*} event 
 * @param {*} mark 
 */
function calcPoints(season, gender, event, mark){

}

function Trackulator() {
  const [season, setSeason] = useState('Indoor');
  const [gender, setGender] = useState('Men');
  const [event, setEvent] = useState('');
  const [mark, setMark] = useState('');
  const [points, setPoints] = useState('');
  const [history, setHistory] = useState([]);

  const handleSave = () => {
    const newEntry = { season, gender, event, mark, points };
    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  return (
    <div className="trackulator-container">
        <TopMenu/>
        <div className="trackulator-content">
            <h1>Trackulator</h1>
            <div className='input-history-body'>
                <div className='trackulator-inputs'>
                    <div className="input-group">
                        <label>Season:</label>
                        <select value={season} onChange={(e) => setSeason(e.target.value)}>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>Gender:</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>Event:</label>
                        <input type="text" value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Enter event" />
                    </div>
                    
                    <div className="input-group">
                        <label>Mark:</label>
                        <input type="text" value={mark} onChange={(e) => setMark(e.target.value)} placeholder="Enter mark" />
                    </div>
                    
                    <div className="input-group">
                        <label>Points:</label>
                        <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Enter points" />
                    </div>
                    <button onClick={handleSave} className="save-button">Save Entry</button>
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
