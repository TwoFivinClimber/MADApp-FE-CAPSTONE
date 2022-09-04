/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import React, { Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { getPublicEvents } from '../api/events/eventData';
import EventCard from '../components/EventCard';
// import { useAuth } from '../utils/context/authContext';

function Home() {
  const [featuredEvent, setFeaturedEvent] = useState({});

  const getFeatured = () => {
    getPublicEvents().then((eventsArr) => {
      const index = Math.floor(Math.random() * eventsArr.length);
      setFeaturedEvent(eventsArr[index]);
    });
  };

  useEffect(() => {
    getFeatured();
  }, []);

  return (
    <div>
      <div className="mainDiv">
        <Image className="backgroundImage" src="https://res.cloudinary.com/twofiveclimb/image/upload/v1662000538/IMG_8989_lgto2x.jpg" />
        <div className="mainHeadSearch">
          <h1>Find Your Day</h1>
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
        </div>
      </div>
      <div className="mainFeaturedDiv">
        <h4>Featured Event</h4>
        <EventCard obj={featuredEvent} onUpdate={getFeatured} />
      </div>
    </div>
  );
}

export default Home;
