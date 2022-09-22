import React from 'react';
import {
  Card, Image, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';

function ProfileCard({ userObj }) {
  return (
    <Card className="userProfileCard">
      <Image variant="start" className="user-form-image" thumbnail src={userObj.imageUrl} />
      <div className="profileInfoDiv">
        <Card.Title>{userObj.userName}</Card.Title>
        <Card.Text>{userObj.tagLine}</Card.Text>
        <Card.Text>{userObj.homeCity}</Card.Text>
        <Card.Text>{userObj.age}</Card.Text>
      </div>
      <div className="profileInterestDiv">
        <h6>Interests</h6>
        <Card.Text>{userObj.interestOne}</Card.Text>
        <Card.Text>{userObj.interestTwo}</Card.Text>
        <Card.Text>{userObj.interestThree}</Card.Text>
      </div>
      <DropdownButton align="end" variant="secondary" className="profile-dropdown" title={<FaEllipsisV className="droptoggleicon" />}>
        <Dropdown.Divider />
      </DropdownButton>
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
