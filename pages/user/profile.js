/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import { getDaysbyUid } from '../../api/day/dayData';
import { getEventsByUid } from '../../api/events/eventData';
import { deleteUser, getUser } from '../../api/user/userData';
import DayCard from '../../components/DayCard';
import EventCard from '../../components/EventCard';
import { signOut } from '../../utils/auth';
import { useAuth } from '../../utils/context/authContext';

function UserProfile() {
  const { user } = useAuth();
  const [authUser, setAuthUser] = useState({});
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState([]);
  const router = useRouter();

  const getContent = () => {
    getUser(user.uid).then((userArray) => {
      setAuthUser(userArray[0]);
      getEventsByUid(user.uid).then(setEvents);
      getDaysbyUid(user.uid).then(setDays);
    });
  };

  useEffect(() => {
    getContent();
  }, [router]);

  const deleteProfile = () => {
    if (window.confirm('Be Careful! this will delete all of your posts.  Ae you sure ?')) {
      deleteUser(authUser.firebaseKey).then(signOut);
      router.push('/');
    }
  };

  return (
    <>
      <Card className="userProfileCard" style={{ width: '100%' }}>
        <Card.Img style={{ width: '100%', maxWidth: '150px', height: 'auto' }} variant="start" src={authUser.imageUrl} />
        <div className="profileInfoDiv">
          <Card.Title>{authUser.userName}</Card.Title>
          <Card.Text>{authUser.tagLine}</Card.Text>
          <Card.Text>{authUser.homeCity}</Card.Text>
        </div>
        <div className="profileInterestDiv">
          <h6>Interests</h6>
          <Card.Text>{authUser.interestOne}</Card.Text>
          <Card.Text>{authUser.interestTwo}</Card.Text>
          <Card.Text>{authUser.interestThree}</Card.Text>
        </div>
        <DropdownButton align="end" variant="secondary" className="cardDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/user/edit/${authUser.firebaseKey}`)}>Edit Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="deleteDropDownItem" onClick={deleteProfile}>Delete Profile</Dropdown.Item>
        </DropdownButton>
      </Card>
      <div className="userEventsDiv">
        <h4>Your Events</h4>
        {events.map((event) => (
          <EventCard key={event.firebaseKey} obj={event} onUpdate={getContent} />
        ))}
        {days.map((day) => (
          <DayCard key={day.firebaseKey} obj={day} onUpdate={getContent} />
        ))}
      </div>
    </>
  );
}
export default UserProfile;
