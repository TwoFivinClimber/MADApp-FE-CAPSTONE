/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Card, Image, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { getImagesByEvent } from '../api/images/imageData';
import { deleteEvent } from '../api/events/mergedEvents';
import { useAuth } from '../utils/context/authContext';

const EventCard = ({ obj, onUpdate }) => {
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  const getTheImages = async () => {
    await getImagesByEvent(obj.firebaseKey).then(setImages);
  };

  const deleteThisEvent = () => {
    if (window.confirm('Are You Sure ?')) {
      deleteEvent(obj.firebaseKey).then(onUpdate);
    }
  };

  useEffect(() => {
    getTheImages();
  }, [obj]);

  return (
    <Card className="eventCard">
      <Card.Body className="eventCardLeft">
        <Card.Title className="eventCardTitle">{obj.title}</Card.Title>
        <Card.Text>{obj.date}</Card.Text>
        <Card.Text>{obj.location}</Card.Text>
        <Card.Text>{obj.city}</Card.Text>
        <Card.Text>{obj.userName}</Card.Text>
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
      </Card.Body>
      <Card.Body className="eventCardCenter">
        <Card.Text>{obj.description}</Card.Text>
      </Card.Body>
      <div className="eventCardImages">
        {images.map((image) => (
          <Image key={image.firebaseKey} src={image.imageUrl} width={125} height={100} rounded />
        ))}
      </div>
      {router.route === '/' ? ('') : (
        <DropdownButton align="end" variant="secondary" className="cardDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/event/${obj.firebaseKey}`)}>View</Dropdown.Item>
          {user.uid === obj.uid ? (
            <>
              <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/event/edit/${obj.firebaseKey}`)}>Edit</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="dropDownItem" onClick={deleteThisEvent}>Delete</Dropdown.Item>
            </>
          ) : ('')}
        </DropdownButton>
      )}
    </Card>
  );
};

EventCard.propTypes = {
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

export default EventCard;
