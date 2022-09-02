/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import PropTypes from 'prop-types';
import { getImagesByEvent } from '../api/images/imageData';

const EventCard = ({ obj }) => {
  const [images, setImages] = useState([]);

  const getTheImages = () => {
    getImagesByEvent(obj.firebaseKey).then(setImages);
  };

  useEffect(() => {
    getTheImages();
  }, []);

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
          size={24}
          readonly
        />
      </Card.Body>
      <Card.Body className="eventCardCenter">
        <Card.Text>{obj.description}</Card.Text>
      </Card.Body>
      <div className="eventCardImages">
        {images?.map((image) => (
          <Image key={image.firebaseKey} src={image.imageUrl} width={125} height={100} rounded />
        ))}
      </div>
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
};

export default EventCard;
