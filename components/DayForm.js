/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Form, Button, Modal,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
// import { createDay, updateDay } from '../api/day/dayData';
import AsyncCreatable from 'react-select/async-creatable';
import { useAuth } from '../utils/context/authContext';
import EventModalCard from './EventModalCard';
import { createDay, updateDay } from '../api/day/dayData';
import { handleDayEvents } from '../api/events/mergedEvents';
import { getDayFormPackage } from '../api/day/mergedDayData';
import { getCity } from '../api/tom-tom';
import EventCardNew from './EventCardNew';

const initialState = {
  title: '',
  date: '',
  uid: '',
  city: '',
  description: '',
  isPublic: false,
  firebaseKey: '',
  createdDate: Date.now(),
};

function DayForm({ obj }) {
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState(initialState);
  const [dayEvents, setDayEvents] = useState([]);
  // EVENTS TO BE SHOWN AS SELECTED //
  const selectedEvents = events.filter((event) => dayEvents.includes(event.firebaseKey));
  // EVENTS TO SHOW IN MODAL //
  const modalEvents = events.filter((event) => event.date === input.date);
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
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    console.warn(events, input.date);
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

  const handleCitySelect = (selected) => {
    if (selected) {
      const { value } = selected;
      setInput((prevState) => ({
        ...prevState,
        city: value,
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        city: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateDay(input).then(() => {
        handleDayEvents(obj.firebaseKey, dayEvents).then(() => {
          router.push('/user/profile');
        });
      });
    } else {
      createDay(input).then((dayObj) => {
        handleDayEvents(dayObj.firebaseKey, dayEvents).then(() => {
          router.push('/user/profile');
        });
      });
    }
  };

  // Tom Tom API //
  const cityOptions = (target) => new Promise((resolve, reject) => {
    getCity(target).then((cityArr) => {
      resolve(cityArr.filter((city) => city.value.toLowerCase().includes(target.toLowerCase())));
    }).catch(reject);
  });
  const getTheContent = () => {
    getDayFormPackage(obj.firebaseKey, user.uid).then((dayFormObj) => {
      setDayEvents(dayFormObj.dayEvents);
      setEvents(dayFormObj.events);
    });
    if (obj.firebaseKey) {
      setInput(obj);
    } else {
      setInput((prevState) => ({
        ...prevState,
        uid: user.uid,
      }));
    }
  };

  useEffect(() => {
    getTheContent();
  }, [obj]);

  return (
    <>
      <h4 className="day-form">{obj.firebaseKey ? 'Edit' : 'Create'} Your Awesome Day</h4>
      <Form onSubmit={handleSubmit}>
        <div className="day-form-title-city">
          <div>
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={input.title} onChange={handleChange} type="text" placeholder="Title Your Event" required />
          </div>
          <div>
            <Form.Label>Date</Form.Label>
            <Form.Control name="date" value={input.date} onChange={handleChange} type="date" placeholder="When Day " required />
          </div>
        </div>
        <div className="day-form-city-public">
          <div>
            <Form.Label>City</Form.Label>
            <AsyncCreatable
              backspaceRemovesValue
              isClearable
              onChange={handleCitySelect}
              value={{ label: input.city, value: input.city }}
              loadOptions={cityOptions}
            />
          </div>
          <div className="day-form-public-div">
            <Form.Check
              className="day-form-public-check"
              name="isPublic"
              checked={input.isPublic}
              onChange={handleChange}
              type="switch"
              id="custom-switch"
              label="Make it Public ?"
            />
          </div>
        </div>
        <div className="day-form-select-events">
          <Form.Label className="day-form-events-select-head">Select Events or Create For Your Day (Events need to have the same date as your day)</Form.Label>
          <div className="day-form-events-buttons">
            <Button variant="primary" onClick={handleShow}>
              Select Events
            </Button>
            <Modal show={show} name="eventOfDay" onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Select Your Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {modalEvents.length ? (
                  modalEvents.map((event) => (
                    <div key={event.firebaseKey} className="modalEventCheck">
                      <Form.Check
                        className="day-form-modal-check"
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
            <Button variant="warning" onClick={() => router.push('/event/new')}>Create An Event</Button>
          </div>
        </div>
        <div className="day-form-description">
          <Form.Label>Describe Your Experience</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={input.description} onChange={handleChange} placeholder="Tell the people about it" required />
        </div>
        <h4 className="day-form-events-header">Selected Events</h4>
        <div className="dayEventDiv">
          {selectedEvents.map((event) => (
            <EventCardNew key={event.firebaseKey} onUpdate={getTheContent} obj={event} />
          ))}
        </div>
        <div className="day-form-submit-buttons">
          <Button type="submit" variant="success">{obj.firebaseKey ? 'Update' : 'Submit'}</Button>
          <Button variant="danger" onClick={() => router.push('/user/profile')}>Cancel</Button>
        </div>
      </Form>
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
