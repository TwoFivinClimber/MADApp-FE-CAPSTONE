import React, { useEffect, useState } from 'react';
import { getPublicDays } from '../api/day/dayData';
import DayCard from '../components/DayCard';

function BrowseDays() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    getPublicDays().then(setDays);
  }, []);

  return (
    <>
      <h4>Browse Days</h4>
      {days.map((day) => (
        <DayCard key={day.firebaseKey} obj={day} />
      ))}
    </>
  );
}

export default BrowseDays;
