import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getSingleEvent } from '../../../api/events/eventData';
import EventForm from '../../../components/EventForm';

function EditEvent() {
  const [event, setEvent] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

  useEffect(() => {
    getSingleEvent(firebaseKey).then(setEvent);
  }, [firebaseKey]);

  return (
    <EventForm obj={event} />
  );
}

export default EditEvent;
