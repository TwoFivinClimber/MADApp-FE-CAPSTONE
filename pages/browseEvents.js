import React, { useEffect, useState } from 'react';
import { getPublicEvents } from '../api/events/eventData';
// import EventCard from '../components/EventCard';
import EventCardNew from '../components/EventCardNew';

function BrowseEvents() {
  const [events, setEvents] = useState([]);

  const getTheEvents = () => {
    getPublicEvents().then(setEvents);
  };

  useEffect(() => {
    getTheEvents();
  }, []);

  return (
    <div>
      <h4>Browse Events</h4>
      {events.map((event) => (
        <EventCardNew key={event.firebaseKey} obj={event} onUpdate={getTheEvents} />
      ))}
    </div>
  );
}

export default BrowseEvents;
