import React, { useState } from 'react';
import './DateDifference.css';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import TopMenu from './menus/TopMenu';
import BottomMenu from './menus/BottomMenu';

function DateDifference() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difference, setDifference] = useState(null);

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      alert('Please select both dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('Start date must be before end date.');
      return;
    }

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;
    const days = differenceInDays(end, start) % 30;

    setDifference({ years, months, days });
  };

  return (
    <div className="date-difference">
        <TopMenu/>
        <div className="date-content">
          <h1 id='date-difference-title'>Date Difference Calculator</h1>
          <div className="date-inputs">
              <div className="input-group">
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                  />
              </div>
              <div className="input-group">
                  <label htmlFor="end-date">End Date:</label>
                  <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                  />
                  </div>
          </div>
          <button className="calculate-button" onClick={calculateDifference}>
              Calculate Difference
          </button>

          {difference && (
              <div className="result">
              <h2>Difference:</h2>
              <p>{difference.years} Years, {difference.months} Months, {difference.days} Days</p>
              </div>
          )}
      </div>
      <BottomMenu/>
    </div>
  );
}

export default DateDifference;
