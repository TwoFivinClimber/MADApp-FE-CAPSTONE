/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
// import { FaEllipsisV } from 'react-icons/fa';
// import { getDaysbyUid } from '../../api/day/dayData';
// import { getEventsByUid } from '../../api/events/eventData';
import { getPublicContentByUser } from '../../api/events/mergedEvents';
import { getUser } from '../../api/user/userData';
import DayCard from '../../components/DayCard';
import EventCard from '../../components/EventCard';
import ProfileCard from '../../components/ProfileCard';
// import { useAuth } from '../../utils/context/authContext';

function UserPage() {
  // const { user } = useAuth();
  const [pageUser, setPageUser] = useState({});
  const [content, setContent] = useState([]);
  const router = useRouter();
  const { uid } = router.query;

  const getTheContent = () => {
    getUser(uid).then((userArray) => {
      setPageUser(userArray[0]);
      getPublicContentByUser(uid).then(setContent);
    });
  };

  useEffect(() => {
    getTheContent();
  }, [router]);

  return (
    <>
      <h4>User Page</h4>
      <ProfileCard userObj={pageUser} />
      <div className="userEventsDiv">
        <h4>Events</h4>
        {content.map((event) => (
          event.category ? <EventCard key={event.firebaseKey} obj={event} onUpdate={getTheContent} /> : <DayCard obj={(event)} key={event.firebaseKey} onUpdate={getTheContent} />
        ))}
      </div>
    </>
  );
}
export default UserPage;
