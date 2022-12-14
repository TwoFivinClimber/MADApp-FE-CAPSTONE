/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Image, Carousel,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';
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
    return () => {
      setEvents([]);
      setImages([]);
      setDayUser([]);
    };
  }, [obj, user]);

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
                <Card.Img className="comment-User-Image" src={dayUser?.imageUrl} />
              </Link>
            ) : (
              <Link href={`/user/${dayUser?.uid}`} passHref>
                <Card.Img className="comment-User-Image" src={dayUser?.imageUrl} />
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
            size={20}
            className="star-rating"
            tooltipClassName="star-rating-tooltip"
            tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
            tooltipStyle={{
              height: 'auto', width: 'auto', fontSize: '10px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
            }}
          />
        </div>
      </Card.Body>
      <div className="day-card-bottom">
        <div className="day-card-events">
          <h5 className="day-card-events-header">Events</h5>
          <div className="day-card-events-list">
            {events.map((event) => (
              <h5 className="day-card-event" key={event.firebaseKey}>{event.title}</h5>
            ))}
          </div>
        </div>
        <div className="day-card-photos">
          <Carousel activeIndex={index} onSelect={handleImageRotation} interval={null}>
            {images?.map((url) => (
              <Carousel.Item key={url}>
                <Image
                  className="day-card-image d-block"
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
