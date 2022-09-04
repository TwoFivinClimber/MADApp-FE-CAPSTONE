/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Form, Button, Modal, Dropdown,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
// import { createDay, updateDay } from '../api/day/dayData';
import { getEventsByUid } from '../api/events/eventData';
import { useAuth } from '../utils/context/authContext';
import EventModalCard from './EventModalCard';

const initialState = {
  title: '',
  date: '',
  category: '',
  uid: '',
  city: '',
  description: '',
  isPublic: false,
};

function DayForm({ obj }) {
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState(initialState);
  const [dayEvents, setDayEvents] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    console.warn(e.target);
    // eslint-disable-next-line prefer-const
    let { name, value } = e.target;
    if (name === 'isPublic') {
      value = e.target.checked;
    }
    if (name === 'eventOfDay') {
      setDayEvents((prevState) => ([
        ...prevState, {
          [name]: value,
        }]
      ));
    }
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.warn(name, value);
    console.warn(dayEvents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (obj.firebaseKey) {
    //   updateDay(input).then(() => {
    //     router.push('/user/profile');
    //   });
    // } else {
    //   createDay(input).then(() => router.push('/'));
    // }
  };

  useEffect(() => {
    getEventsByUid(user.uid).then(setEvents);
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
        <Button variant="primary" onClick={handleShow}>
          Select An Event
        </Button>

        <Modal show={show} name="eventOfDay" onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Select Your Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {events.map((event) => (
              <Dropdown.Item key={event.firebaseKey} name="eventOfDay" value={event.firebaseKey} onClick={handleChange}> <EventModalCard obj={event} /> </Dropdown.Item>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Button variant="warning" onClick={() => router.push('/event/new')}>Add An Event</Button>
      </Form>
      <div className="dayEventDiv">
        <h4>Selected Events</h4>
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
