/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Image,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';
import { getEventsByDay } from '../api/events/eventData';
import EventCard from './EventCard';
import { deleteDay } from '../api/day/mergedDayData';
import { useAuth } from '../utils/context/authContext';
import { getUser } from '../api/user/userData';

function DayCard({ obj, onUpdate }) {
  const [events, setEvents] = useState([]);
  const [dayUser, setDayUser] = useState({});
  const router = useRouter();
  const { user } = useAuth();

  const getTheContent = () => {
    getEventsByDay(obj.firebaseKey).then(setEvents);
    getUser(obj.uid).then((userArr) => {
      setDayUser(userArr[0]);
    });
  };

  useEffect(() => {
    getTheContent();
  }, [obj]);

  const deleteThisDay = () => {
    if (window.confirm('Are you Sure?  Your Day Looks Awesome!')) {
      deleteDay(obj.firebaseKey).then(() => {
        onUpdate();
      });
    }
  };

  const rating = events.reduce((a, b) => a + b.starRating / events.length, 0);

  return (
    <Card className="dayCard">
      <div className="dayCardHead">
        <Card.Body className="dayCardLeft">
          <Card.Title className="dayCardTitle">{obj.title}</Card.Title>
          {dayUser.uid === user.uid ? (
            <Link href="/user/profile" passHref>
              <Image className="commentUserImage" src={dayUser.imageUrl} />
            </Link>
          ) : (
            <Link href={`/user/${dayUser.uid}`} passHref>
              <Image className="commentUserImage" src={dayUser.imageUrl} />
            </Link>
          )}
          <Card.Text>{dayUser.userName}</Card.Text>
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
          {user.uid === obj.uid ? (
            <>
              <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/day/edit/${obj.firebaseKey}`)}>Edit</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="dropDownItem" onClick={deleteThisDay}>Delete</Dropdown.Item>
            </>
          ) : ('')}
        </DropdownButton>
      </div>
      <div className="eventsDiv">
        {events.map((event) => (
          <EventCard key={event.firebaseKey} obj={event} />
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
