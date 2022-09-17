import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ProfileCard({ userObj }) {
  return (
    <Card className="userProfileCard" style={{ width: '100%' }}>
      <Card.Img style={{ width: '100%', maxWidth: '150px', height: 'auto' }} variant="start" src={userObj.imageUrl} />
      <div className="profileInfoDiv">
        <Card.Title>{userObj.userName}</Card.Title>
        <Card.Text>{userObj.tagLine}</Card.Text>
        <Card.Text>{userObj.homeCity}</Card.Text>
      </div>
      <div className="profileInterestDiv">
        <h6>Interests</h6>
        <Card.Text>{userObj.interestOne}</Card.Text>
        <Card.Text>{userObj.interestTwo}</Card.Text>
        <Card.Text>{userObj.interestThree}</Card.Text>
      </div>
    </Card>
  );
}

ProfileCard.propTypes = {
  userObj: PropTypes.shape({
    userName: PropTypes.string,
    imageUrl: PropTypes.string,
    tagLine: PropTypes.string,
    homeCity: PropTypes.string,
    interestOne: PropTypes.string,
    interestTwo: PropTypes.string,
    interestThree: PropTypes.string,
  }).isRequired,
};

export default ProfileCard;
