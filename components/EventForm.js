/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/context/authContext';
import getCategories from '../api/categories';

const initialState = {
  title: '',
  date: '',
  timeOfDay: '',
  category: '',
  location: '',
  city: '',
  description: '',
  starRating: 0,
  isPublic: false,
};

function EventForm({ obj }) {
  const user = useAuth();
  const [input, setInput] = useState({ initialState });
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.warn(name, value);
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn(input);
  };

  useEffect(() => {
    getCategories().then(setCategories);
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
    <Form onSubmit={handleSubmit}>
      <Form.Label>Title</Form.Label>
      <Form.Control name="title" value={input.title} onChange={handleChange} type="text" placeholder="Title Your Day" />
      <Form.Label>Date</Form.Label>
      <Form.Control name="date" value={input.date} onChange={handleChange} type="date" placeholder="When Day " />

      <Form.Label>Time of Day</Form.Label>
      <Form.Select aria-label="Time of Day" name="timeOfDay" value={input.timeOfDay} onChange={handleChange}>
        <option value="">Select a Time of Day</option>
        <option value="morning">Morning</option>
        <option value="day-time">Day Time</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
        <option value="night">Night</option>
      </Form.Select>
      <Form.Label>Category</Form.Label>
      <Form.Select aria-label="category" name="category" value={input.category} onChange={handleChange}>
        <option value="">Select a Category</option>
        {categories.map((category) => (
          <option key={category.category} value={category.category}>{category.category}</option>
        ))}
      </Form.Select>
      <Form.Label>Location</Form.Label>
      <Form.Control name="location" value={input.location} onChange={handleChange} type="text" placeholder="Where were you?" />
      <Form.Label>City</Form.Label>
      <Form.Control name="city" value={input.city} onChange={handleChange} type="text" placeholder="What City ?" />
      <Form.Label>Describe Your Experience</Form.Label>
      <Form.Control as="textarea" rows={3} name="description" value={input.description} onChange={handleChange} placeholder="Tell the people about it" />
      <Form.Label>How was it ?</Form.Label>
      <div className="eventStarAndPublic">
        <Rating
          name="starRating"
          ratingValue={input.starRating}
          initialValue={0}
          onChange={handleChange}
        />
        <Form.Check
          name="isPublic"
          value={input.isPublic}
          onChange={handleChange}
          type="switch"
          id="custom-switch"
          label="Public ?"
        />
      </div>
      <Button type="submit" variant="success">Submit</Button>
      <Button variant="danger" onClick={() => router.push('/')}>Cancel</Button>
    </Form>
  );
}

EventForm.propTypes = {
  obj: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    timeOfDay: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    city: PropTypes.string,
    description: PropTypes.string,
    starRating: PropTypes.number,
    isPublic: PropTypes.bool,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

export default EventForm;
