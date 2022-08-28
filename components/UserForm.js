/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import getCategories from '../api/categories';
import { useAuth } from '../utils/context/authContext';
import { createUser, updateUser } from '../api/user/userData';

const initialState = {
  uid: '',
  userName: '',
  imageUrl: '',
  tagLine: '',
  homeCity: '',
  age: 0,
  interestOne: '',
  interestTwo: '',
  interestThree: '',
};

function UserForm({ obj }) {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState(initialState);

  useEffect(() => {
    getCategories().then(setCategories);
    if (obj.firebaseKey) {
      setInput(obj);
    } else {
      setInput((prevState) => ({
        ...prevState,
        uid: user.uid,
        userName: user.displayName,
        imageUrl: user.photoURL,
      }));
    }
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateUser(input).then(() => router.push('/user/profile'));
    } else {
      createUser(input).then(() => router.push('/user/profile'));
    }
  };

  return (
    <>
      <h4>{obj.firebaseKey ? 'Edit' : 'Create'} Your Profile</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Profile Name</Form.Label>
        <Form.Control name="userName" value={input.userName} onChange={handleChange} type="text" placeholder="Enter Profile Name" />
        <Form.Label>Image Url</Form.Label>
        <Form.Control name="imageUrl" value={input.imageUrl} onChange={handleChange} type="text" />
        <Form.Label>Tag Line</Form.Label>
        <Form.Control name="tagLine" value={input.tagLine} onChange={handleChange} type="text" placeholder="Just Tryna Be Awesome" />
        <Form.Label>Home City</Form.Label>
        <Form.Control name="homeCity" value={input.homeCity} onChange={handleChange} type="text" placeholder="Enter Your Home City" />
        <Form.Label>Age</Form.Label>
        <Form.Control name="age" value={input.age} onChange={handleChange} type="text" placeholder="Enter Your Age" />

        <Form.Label>Interest 1</Form.Label>
        <Form.Select aria-label="Interest 1" name="interestOne" value={input.interestOne} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <br />
        <Form.Select aria-label="Interest 2" name="interestTwo" value={input.interestTwo} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <br />
        <Form.Select aria-label="Interest 3" name="interestThree" value={input.interestThree} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <br />
        <Button type="submit" variant="success">Submit</Button>
        {obj.firebaseKey ? (
          <Button variant="danger" onClick={() => router.push('/user/profile')}>Cancel</Button>
        ) : (
          <Button variant="danger" onClick={() => router.push('/')}>Cancel</Button>
        )}
      </Form>
    </>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    uid: PropTypes.string,
    userName: PropTypes.string,
    imageUrl: PropTypes.string,
    tagLine: PropTypes.string,
    homeCity: PropTypes.string,
    age: PropTypes.string,
    interestOne: PropTypes.string,
    interestTwo: PropTypes.string,
    interestThree: PropTypes.string,
  }).isRequired,
};

export default UserForm;
