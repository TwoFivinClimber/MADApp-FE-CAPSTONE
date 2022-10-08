import React from 'react';
import {
  Card, Image,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';

function ProfileCard({ userObj }) {
  return (
    <Card className="user-Profile-Card">
      <div className="user-Profile-Image">
        <Image variant="start" className="user-profile-image" thumbnail src={userObj.imageUrl} />
      </div>
      <div className="profile-Info-Div">
        <Card.Title>{userObj.userName}</Card.Title>
        <Card.Text>{userObj.tagLine}</Card.Text>
        <Card.Text>{userObj.homeCity}</Card.Text>
        <Card.Text>{userObj.age}</Card.Text>
      </div>
      <div className="profile-Interest-Div">
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
    age: PropTypes.number,
    homeCity: PropTypes.string,
    interestOne: PropTypes.string,
    interestTwo: PropTypes.string,
    interestThree: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

export default ProfileCard;
