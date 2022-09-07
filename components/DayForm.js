/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Form, Button, Modal,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
// import { createDay, updateDay } from '../api/day/dayData';
import { getEventsByUid, getEventsByDay } from '../api/events/eventData';
import { useAuth } from '../utils/context/authContext';
import EventModalCard from './EventModalCard';
import EventCard from './EventCard';
import { createDay, updateDay } from '../api/day/dayData';
import { handleDayEvents } from '../api/events/mergedEvents';

const initialState = {
  title: '',
  date: '',
  uid: '',
  city: '',
  description: '',
  isPublic: false,
  firebaseKey: '',
};

function DayForm({ obj }) {
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState(initialState);
  const [dayEvents, setDayEvents] = useState([]);
  // EVENTS TO BE SHOWN AS SELECTED //
  const selectedEvents = events.filter((event) => dayEvents.includes(event.firebaseKey));
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    // eslint-disable-next-line prefer-const
    let { name, value } = e.target;
    if (name === 'isPublic') {
      value = e.target.checked;
    }
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChecked = (e) => {
    const { value } = e.target;
    if (e.target.checked) {
      setDayEvents((prevState) => ([
        ...prevState,
        value,
      ]));
    } else {
      setDayEvents((prevState) => {
        const prevCopy = [...prevState];
        const index = prevCopy.indexOf(value);
        prevCopy.splice(index, 1);
        return prevCopy;
      });
    }
  };
  const handleClear = () => {
    setDayEvents([]);
  };

  const handleShowEvents = async () => {
    await getEventsByUid(user.uid).then((eventsArr) => {
      setEvents(eventsArr.filter((event) => event.date === input.date));
    });
    handleShow();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateDay(input).then(() => {
        handleDayEvents(obj.firebaseKey, dayEvents);
        router.push('/user/profile');
      });
    } else {
      createDay(input).then((dayObj) => {
        handleDayEvents(dayObj.firebaseKey, dayEvents);
        router.push('/user/profile');
      });
    }
  };

  useEffect(() => {
    getEventsByDay(obj.firebaseKey).then((eventsArr) => {
      setDayEvents(eventsArr.map((event) => event.firebaseKey));
    });
    if (obj.firebaseKey) {
      setInput(obj);
    } else {
      setInput((prevState) => ({
        ...prevState,
        uid: user.uid,
      }));
    }
  }, [obj]);

  return (
    <>
      <h4>Awesome Day Form</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={input.title} onChange={handleChange} type="text" placeholder="Title Your Event" required />
        <Form.Label>Date</Form.Label>
        <Form.Control name="date" value={input.date} onChange={handleChange} type="date" placeholder="When Day " required />
        <Form.Label>City</Form.Label>
        <Form.Control name="city" value={input.city} onChange={handleChange} type="text" placeholder="What City ?" required />
        <Form.Label>Describe Your Experience</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={input.description} onChange={handleChange} placeholder="Tell the people about it" required />
        <Form.Check
          name="isPublic"
          value={input.isPublic}
          onChange={handleChange}
          defaultChecked={input.isPublic}
          type="switch"
          id="custom-switch"
          label="Public ?"
        />
        <Button variant="primary" onClick={handleShowEvents}>
          Select An Event
        </Button>

        <Modal show={show} name="eventOfDay" onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Select Your Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {events.length ? (
              events.map((event) => (
                <div key={event.firebaseKey} className="modalEventCheck">
                  <Form.Check
                    type="checkbox"
                    value={event.firebaseKey}
                    onChange={handleChecked}
                    checked={dayEvents.includes(event.firebaseKey)}
                  />
                  <EventModalCard obj={event} />
                </div>
              ))
            ) : (
              <h6> Please select a date or create events on this day</h6>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Button variant="warning" onClick={() => router.push('/event/new')}>Add An Event</Button>
        <Button type="submit" variant="success">{obj.firebaseKey ? 'Update' : 'Submit'}</Button>
        <Button variant="danger" onClick={() => router.push('/user/profile')}>Cancel</Button>
      </Form>
      <div className="dayEventDiv">
        <h4>Selected Events</h4>
        {selectedEvents.map((event) => (
          <EventCard obj={event} />
        ))}
      </div>
    </>
  );
}

DayForm.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    city: PropTypes.string,
    description: PropTypes.string,
    starRating: PropTypes.number,
    isPublic: PropTypes.bool,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

export default DayForm;
