/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Image,
} from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import { getDaysbyUid } from '../../api/day/dayData';
import { getEventsByUid } from '../../api/events/eventData';
import { deleteUser } from '../../api/user/mergedUser';
import { getUser } from '../../api/user/userData';
// import DayCard from '../../components/DayCard';
import DayCardNew from '../../components/DayCardNew';
// import EventCard from '../../components/EventCard';
import EventCardNew from '../../components/EventCardNew';
import { signOut } from '../../utils/auth';
import { useAuth } from '../../utils/context/authContext';

function UserProfile() {
  const { user } = useAuth();
  const [authUser, setAuthUser] = useState({});
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const router = useRouter();

  const getTheContent = () => {
    getUser(user.uid).then((userArray) => {
      setAuthUser(userArray[0]);
      getEventsByUid(user.uid).then(setEvents);
      getDaysbyUid(user.uid).then(setDays);
    });
  };

  useEffect(() => {
    getTheContent();
  }, [router]);

  const deleteProfile = () => {
    if (window.confirm('Be Careful! This will delete all of your posts.  Ae you sure ?')) {
      deleteUser(authUser.firebaseKey, user.uid).then(signOut);
      router.push('/');
    }
  };

  return (
    <>
      <Card className="userProfileCard">
        <div className="userProfileImage">
          <Image variant="start" className="user-form-image" thumbnail src={authUser.imageUrl} />
        </div>
        <div className="profileInfoDiv">
          <Card.Title>{authUser.userName}</Card.Title>
          <Card.Text>{authUser.tagLine}</Card.Text>
          <Card.Text>{authUser.homeCity}</Card.Text>
          <Card.Text>{authUser.age}</Card.Text>
        </div>
        <div className="profileInterestDiv">
          <h6>Interests</h6>
          <Card.Text>{authUser.interestOne}</Card.Text>
          <Card.Text>{authUser.interestTwo}</Card.Text>
          <Card.Text>{authUser.interestThree}</Card.Text>
        </div>
        <DropdownButton align="end" variant="secondary" className="profile-dropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/user/edit/${authUser.firebaseKey}`)}>Edit Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="deleteDropDownItem" onClick={deleteProfile}>Delete Profile</Dropdown.Item>
        </DropdownButton>
      </Card>
      <h4 className="profile-events-header">Your Posts</h4>
      <div className="userEventsDiv">
        {events.map((event) => (
          <EventCardNew key={event.firebaseKey} obj={event} onUpdate={getTheContent} />
        ))}
        {days.map((day) => (
          <DayCardNew key={day.firebaseKey} obj={day} onUpdate={getTheContent} />
        ))}
      </div>
    </>
  );
}
export default UserProfile;
