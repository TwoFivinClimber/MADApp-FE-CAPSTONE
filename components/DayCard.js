import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import { getEventsByDay } from '../api/events/eventData';
import EventCard from './EventCard';

function DayCard({ obj, onUpdate }) {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getEventsByDay(obj.firebaseKey).then(setEvents);
  }, [obj]);

  const deleteThisDay = () => {
    console.warn('deleteClicked');
    onUpdate();
  };

  const rating = events.reduce((a, b) => a + b.starRating / events.length, 0);

  return (
    <Card className="dayCard">
      <div className="dayCardHead">
        <Card.Body className="dayCardLeft">
          <Card.Title className="dayCardTitle">{obj.title}</Card.Title>
          <Card.Text>{obj.date}</Card.Text>
          <Card.Text>{obj.city}</Card.Text>
          <Card.Text className="dayStarText">Average Event Rating</Card.Text>
          <Rating
            name="starRating"
            allowHover={false}
            showTooltip
            allowHalfIcon
            ratingValue={rating}
            readonly
            size={26}
            tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
            tooltipStyle={{
              height: 'auto', width: 'auto', fontSize: '12px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
            }}
          />
        </Card.Body>
        <Card.Body className="dayCardCenter">
          <Card.Text>{obj.description}</Card.Text>
        </Card.Body>
        <DropdownButton align="end" variant="secondary" className="cardDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/day/${obj.firebaseKey}`)}>View</Dropdown.Item>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/day/edit/${obj.firebaseKey}`)}>Edit</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="dropDownItem" onClick={deleteThisDay}>Delete</Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="eventsDiv">
        {events.map((event) => (
          <EventCard obj={event} />
        ))}
      </div>
    </Card>
  );
}

DayCard.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    city: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DayCard;
