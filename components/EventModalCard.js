import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Moment from 'moment';

function EventModalCard({ obj }) {
  return (
    <Card className="event-Modal-Card">
      <Card.Title>{obj.title}</Card.Title>
      <Card.Text>{obj.location}</Card.Text>
      <Card.Text>{Moment(obj.date).format('MM-DD-YYYY')}</Card.Text>
    </Card>
  );
}

EventModalCard.propTypes = {
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

export default EventModalCard;
