import React, { useEffect, useState } from 'react';
import { getPublicDays } from '../api/day/dayData';
// import DayCard from '../components/DayCard';
import DayCardNew from '../components/DayCardNew';

function BrowseDays() {
  const [days, setDays] = useState([]);
  const daysDateSort = days.sort((a, b) => Date.parse(b.date, 'mm-dd-yyyy') - Date.parse(a.date, 'mm-dd-yyyy'));

  const getTheContent = () => {
    getPublicDays().then(setDays);
  };

  useEffect(() => {
    getTheContent();
  }, []);

  return (
    <>
      <h4>Browse Days</h4>
      <div className="browse-days-div">
        {daysDateSort.map((day) => (
          <DayCardNew key={day.firebaseKey} obj={day} onUpdate={getTheContent} />
        ))}
      </div>
    </>
  );
}

export default BrowseDays;
