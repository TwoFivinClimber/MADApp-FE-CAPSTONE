/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Card, Image, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';
import { getImagesByEvent } from '../api/images/imageData';
import { deleteEvent } from '../api/events/mergedEvents';
import { useAuth } from '../utils/context/authContext';
import { getSingleUserByUid } from '../api/user/userData';

const EventCardNew = ({ obj, onUpdate }) => {
  const [images, setImages] = useState([]);
  const [eventUser, setEventUser] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  const getTheContent = () => {
    getSingleUserByUid(obj.uid).then((evUser) => {
      setEventUser(evUser);
    });
    getImagesByEvent(obj.firebaseKey).then(setImages);
  };

  const deleteThisEvent = () => {
    if (window.confirm('Are You Sure ?')) {
      deleteEvent(obj.firebaseKey).then(() => {
        onUpdate();
      });
    }
  };

  useEffect(() => {
    getTheContent();
  }, [obj]);

  const handleImageRotation = (selected) => {
    setIndex(selected);
  };

  return (
    <Card className="event-card">
      <div className="event-card-header">
        <div className="event-card-user">
          {eventUser?.uid === user.uid ? (
            <Link href="/user/profile" passHref>
              <Image className="commentUserImage" src={eventUser?.imageUrl} />
            </Link>
          ) : (
            <Link href={`/user/${eventUser?.uid}`} passHref>
              <Image className="commentUserImage" src={eventUser?.imageUrl} />
            </Link>
          )}
          <Card.Text className="event-card-username">{eventUser?.userName}</Card.Text>
        </div>
        <DropdownButton align="end" variant="secondary" className="event-card-dropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/event/${obj.firebaseKey}`)}>View</Dropdown.Item>
          {user.uid === obj.uid ? (
            <>
              <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/event/edit/${obj.firebaseKey}`)}>Edit</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="dropDownItem" onClick={deleteThisEvent}>Delete</Dropdown.Item>
            </>
          ) : ('')}
        </DropdownButton>
      </div>
      <div className="event-card-carousel">
        <Carousel activeIndex={index} onSelect={handleImageRotation} interval={null}>
          {images.map((image) => (
            <Carousel.Item>
              <img
                className="event-card-image d-block w-100"
                src={image.imageUrl}
                alt="user posted content"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <Card.Body className="event-card-body">
        <div className="event-card-title">
          <Card.Title className="event-card-title">{obj.title}</Card.Title>
        </div>
        <div className="event-card-location">
          <Card.Text>{obj.location}</Card.Text>
          <Card.Text>{obj.city}</Card.Text>
        </div>
        <div className="event-card-rating">
          <Rating
            name="starRating"
            allowHover={false}
            showTooltip
            allowHalfIcon
            tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
            tooltipStyle={{
              height: 'auto', width: 'auto', fontSize: '12px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
            }}
            ratingValue={obj.starRating}
            size={26}
            readonly
          />
        </div>
      </Card.Body>
    </Card>
  );
};

EventCardNew.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    timeOfDay: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    city: PropTypes.string,
    description: PropTypes.string,
    starRating: PropTypes.number,
    isPublic: PropTypes.bool,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
    userName: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EventCardNew;
