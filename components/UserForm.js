/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import AsyncCreatable from 'react-select/async-creatable';
import { getCategories } from '../api/categories';
import { useAuth } from '../utils/context/authContext';
import { createUser, updateUser } from '../api/user/userData';
import { getCity } from '../api/tom-tom';
import uploadPhoto from '../api/cloudinary';

const initialState = {
  uid: '',
  userName: '',
  imageUrl: '',
  tagLine: '',
  homeCity: '',
  lat: 0,
  long: 0,
  age: '',
  interestOne: '',
  interestTwo: '',
  interestThree: '',
};

function UserForm({ obj }) {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState(initialState);
  // const [image, setImage] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelect = (selected) => {
    if (selected) {
      const {
        name, value, lat, long,
      } = selected;
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
        lat,
        long,
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        homeCity: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateUser(input).then(() => router.push('/user/profile'));
    } else {
      createUser(input).then(() => router.push('/user/profile'));
    }
  };

  // TOM TOM API//
  const handleInput = (target) => new Promise((resolve, reject) => {
    getCity(target).then((cityArr) => {
      resolve(cityArr.filter((result) => result.value.toLowerCase().includes(target.toLowerCase())));
    }).catch(reject);
  });

  // IMAGE UPLOAD //
  const uploadImage = async (e) => {
    const payload = new FormData();
    payload.append('file', e.target.files[0]);
    payload.append('upload_preset', 'nofzejna');
    payload.append('cloud_name', 'twofiveclimb');
    await uploadPhoto(payload).then((url) => {
      setInput((prevState) => (
        {
          ...prevState,
          imageUrl: url,
        }
      ));
    });
  };

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

  return (
    <>
      <h4 className="user-form-header">{obj.firebaseKey ? 'Edit' : 'Create'} Your Profile</h4>
      <div className="user-form-image-div">
        <Image variant="start" className="user-form-image" thumbnail roundedCircle src={input.imageUrl} />
        <div className="user-form-upload">
          <Form.Label>Upload Photo</Form.Label>
          <Form.Control type="file" onChange={uploadImage} />
        </div>
      </div>
      <Form className="user-form" onSubmit={handleSubmit}>
        <Form.Label>Profile Name</Form.Label>
        <Form.Control name="userName" value={input.userName} onChange={handleChange} type="text" placeholder="Enter Profile Name" required />
        <Form.Label>Tag Line</Form.Label>
        <Form.Control name="tagLine" value={input.tagLine} onChange={handleChange} type="text" placeholder="Just Tryna Be Awesome" required />
        <Form.Label>Location </Form.Label>
        <AsyncCreatable
          backspaceRemovesValue
          isClearable
          onChange={handleSelect}
          value={{ label: input.homeCity, value: input.homeCity }}
          loadOptions={handleInput}
        />
        <Form.Label>Age</Form.Label>
        <Form.Control name="age" value={input.age} onChange={handleChange} type="text" placeholder="Enter Your Age" required />

        <Form.Label>Interest 1</Form.Label>
        <Form.Select aria-label="Interest 1" name="interestOne" value={input.interestOne} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <Form.Label>Interest 2</Form.Label>
        <Form.Select aria-label="Interest 2" name="interestTwo" value={input.interestTwo} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <Form.Label>Interest 3</Form.Label>
        <Form.Select aria-label="Interest 3" name="interestThree" value={input.interestThree} onChange={handleChange}>
          <option value="">Select an Interest</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <br />
        <Button type="submit" variant="success">Submit</Button>
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
