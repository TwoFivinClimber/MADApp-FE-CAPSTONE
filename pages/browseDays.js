import React, { useEffect, useState } from 'react';
import { getPublicDays } from '../api/day/dayData';
// import DayCard from '../components/DayCard';
import DayCardNew from '../components/DayCardNew';

function BrowseDays() {
  const [days, setDays] = useState([]);

  const getTheContent = () => {
    getPublicDays().then(setDays);
  };

  useEffect(() => {
    getTheContent();
  }, []);

  return (
    <>
      <h4>Browse Days</h4>
      {days.map((day) => (
        <DayCardNew key={day.firebaseKey} obj={day} onUpdate={getTheContent} />
      ))}
    </>
  );
}

export default BrowseDays;
