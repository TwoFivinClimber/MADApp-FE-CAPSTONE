/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Image, Carousel,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';
// import { getEventsByDay } from '../api/events/eventData';
// import EventCard from './EventCard';
import { deleteDay, getDayPackage } from '../api/day/mergedDayData';
import { useAuth } from '../utils/context/authContext';
import { getUser } from '../api/user/userData';

function DayCardNew({ obj, onUpdate }) {
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [dayUser, setDayUser] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  const getTheContent = () => {
    // getEventsByDay(obj.firebaseKey).then(setEvents);
    getDayPackage(obj.firebaseKey).then((dayObj) => {
      setEvents(dayObj.events);
      setImages(dayObj.images);
      getUser(obj.uid).then((userArr) => {
        setDayUser(userArr[0]);
      });
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

  const handleImageRotation = (selected) => {
    setIndex(selected);
  };

  return (
    <Card className="day-card">
      <Card.Body className="day-card-top">
        <div className="day-card-head">
          <Card.Title className="day-card-title">{obj.title}</Card.Title>
          <DropdownButton align="end" variant="secondary" className="day-card-dropdown" title={<FaEllipsisV className="droptoggleicon" />}>
            <Dropdown.Item className="drop-Down-Item" onClick={() => router.push(`/day/${obj.firebaseKey}`)}>View</Dropdown.Item>
            {user.uid === obj.uid ? (
              <>
                <Dropdown.Item className="drop-Down-Item" onClick={() => router.push(`/day/edit/${obj.firebaseKey}`)}>Edit</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="drop-Down-Item" onClick={deleteThisDay}>Delete</Dropdown.Item>
              </>
            ) : ('')}
          </DropdownButton>
        </div>
        <div className="day-card-info">
          <div className="day-card-user">
            {dayUser?.uid === user.uid ? (
              <Link href="/user/profile" passHref>
                <Image className="comment-User-Image" src={dayUser?.imageUrl} />
              </Link>
            ) : (
              <Link href={`/user/${dayUser?.uid}`} passHref>
                <Image className="comment-User-Image" src={dayUser?.imageUrl} />
              </Link>
            )}
            <Card.Text className="day-card-username">{dayUser?.userName}</Card.Text>
          </div>
          <Card.Text className="day-card-city">{obj.city}</Card.Text>
          <Rating
            name="star-Rating"
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
        </div>
      </Card.Body>
      <div className="day-card-bottom">
        <div className="day-card-events">
          <h6 className="day-card-events-header">Events From Day</h6>
          {events.map((event) => (
            <Card.Title>{event.title}</Card.Title>
          ))}
        </div>
        <div className="day-card-photos">
          <Carousel activeIndex={index} onSelect={handleImageRotation} interval={null}>
            {images?.map((url) => (
              <Carousel.Item key={url}>
                <img
                  className="event-card-image d-block w-100"
                  src={url}
                  alt="user posted content"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </Card>
  );
}

DayCardNew.propTypes = {
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

export default DayCardNew;
