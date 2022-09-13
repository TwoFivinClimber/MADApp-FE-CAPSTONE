/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Form, Button, Image, CloseButton,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import AsyncCreatable from 'react-select/async-creatable';
import { useAuth } from '../utils/context/authContext';
import getCategories from '../api/categories';
import uploadPhoto from '../api/cloudinary';
import { createEvent, updateEvent } from '../api/events/eventData';
import { createImages, deleteImagesByEvent } from '../api/images/mergedImage';
import { getImagesByEvent } from '../api/images/imageData';
import { getPoi } from '../api/tom-tom';
import { getUser } from '../api/user/userData';

const initialState = {
  title: '',
  date: '',
  timeOfDay: '',
  category: '',
  location: '',
  uid: '',
  city: '',
  description: '',
  starRating: 0,
  isPublic: false,
  eventOfDay: '',
};

// const testPhotos = ['https://res.cloudinary.com/twofiveclimb/image/upload/v1661898852/mad-app/zgbnsycyrspoioxxlnam.jpg', 'https://res.cloudinary.com/twofiveclimb/image/upload/v1661898841/mad-app/mcn1hin10ovagnzqxibc.jpg', 'https://res.cloudinary.com/twofiveclimb/image/upload/v1661898713/mad-app/pgnkhnfkqxbffjw5tx0q.jpg', 'https://res.cloudinary.com/twofiveclimb/image/upload/v1661898831/mad-app/xdlyve7ecqjwhrzxaykl.jpg'];

function EventForm({ obj }) {
  const { user } = useAuth();
  const [authUser, setAuthUser] = useState({});
  const [input, setInput] = useState(initialState);
  const [categories, setCategories] = useState([]);
  // To Cloudinary ⬇️ //
  const [image, setImage] = useState([]);
  // From Cloudinary For Sample Render and Firebase ⬇️  //
  const [imgUrls, setImgUrls] = useState([]);
  const router = useRouter();

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
    console.warn(authUser);
  };

  const handleRating = (e) => {
    const name = 'starRating';
    const value = e;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      deleteImagesByEvent(obj.firebaseKey).then(() => {
        updateEvent(input).then(() => {
          const imageObjects = imgUrls.map((url) => (
            {
              imageUrl: url,
              eventId: obj.firebaseKey,
              uid: user.uid,
            }
          ));
          createImages(imageObjects);
          router.push('/user/profile');
        });
      });
    } else {
      createEvent(input).then((response) => {
        const imageObjects = imgUrls.map((url) => (
          {
            imageUrl: url,
            eventId: response.firebaseKey,
            uid: user.uid,
          }
        ));
        createImages(imageObjects);
        router.push('/user/profile');
      });
    }
  };

  useEffect(() => {
    getCategories().then(setCategories);
    getUser(user.uid).then((userArr) => {
      setAuthUser(userArr[0]);
    });
    if (obj.firebaseKey) {
      setInput(obj);
      getImagesByEvent(obj.firebaseKey).then((imageArr) => {
        const imageUrls = imageArr.map((img) => img.imageUrl);
        setImgUrls(imageUrls);
      });
    } else {
      setInput((prevState) => ({
        ...prevState,
        uid: user.uid,
      }));
    }
  }, [obj]);

  const uploadImage = async () => {
    const payload = new FormData();
    payload.append('file', image);
    payload.append('upload_preset', 'nofzejna');
    payload.append('cloud_name', 'twofiveclimb');
    await uploadPhoto(payload).then((url) => {
      setImgUrls((prevState) => (
        [...prevState,
          url,
        ]
      ));
    });
  };

  const removePhoto = (url) => {
    setImgUrls((prevState) => {
      const prevCopy = [...prevState];
      const index = prevCopy.indexOf(url);
      prevCopy.splice(index, 1);
      return prevCopy;
    });
  };

  // TOM TOM API//
  const promiseOptions = (inputValue) => new Promise((resolve, reject) => {
    getPoi(inputValue, authUser.lat, authUser.long).then((result) => {
      resolve(result);
    }).catch(reject);
  });

  const handleSelect = (selected) => {
    if (selected.city) {
      const { name, value } = selected;
      const city = `${selected.city}, ${selected.state}`;
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
        city,
      }));
    } else {
      const { value } = selected;
      setInput((prevState) => ({
        ...prevState,
        location: value,
      }));
    }
  };

  return (
    <>
      <h4>{obj.firebaseKey ? 'Edit' : 'Create'} Event</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={input.title} onChange={handleChange} type="text" placeholder="Title Your Event" required />
        <Form.Label>Date</Form.Label>
        <Form.Control name="date" value={input.date} onChange={handleChange} type="date" required />
        <Form.Label>Time of Day</Form.Label>
        <Form.Select aria-label="Time of Day" name="timeOfDay" value={input.timeOfDay} onChange={handleChange} required>
          <option value="">Select a Time of Day</option>
          <option value="morning">Morning</option>
          <option value="day-time">Day Time</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </Form.Select>
        <Form.Label>Category</Form.Label>
        <Form.Select aria-label="category" name="category" value={input.category} onChange={handleChange} required>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </Form.Select>
        <Form.Label>Location</Form.Label>
        <AsyncCreatable
          isClearable
          onChange={handleSelect}
          value={{ label: input.location, value: input.location }}
          loadOptions={promiseOptions}
        />
        <Form.Label>City</Form.Label>
        <Form.Control name="city" value={input.city} onChange={handleChange} type="text" placeholder="What City ?" required />
        <Form.Label>Describe Your Experience</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={input.description} onChange={handleChange} placeholder="Tell the people about it" required />
        <div className="eventStarAndPublic">
          <Rating
            allowHover={false}
            showTooltip
            allowHalfIcon
            tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
            ratingValue={input.starRating}
            onClick={handleRating}
          />
          <Form.Check
            name="isPublic"
            value={input.isPublic}
            onChange={handleChange}
            type="switch"
            defaultChecked={input.isPublic}
            id="custom-switch"
            label="Public ?"
          />
        </div>
        <div className="eventImageUploadDiv">
          <Form.Label>Upload Photos</Form.Label>
          <Form.Group controlId="formFile" className="formFile mb-3">
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
            <Button onClick={uploadImage}>Upload</Button>
          </Form.Group>
        </div>
        <div className="uploadedImagesDiv">
          {imgUrls.map((url) => (
            <div key={url} className="uploadedImagesContainer">
              <Image className="eventFormPhotos" rounded src={url} />
              <CloseButton onClick={() => removePhoto(url)} className="imageDelete" />
            </div>
          ))}
        </div>

        <Button type="submit" variant="success">{obj.firebaseKey ? 'Update' : 'Submit'}</Button>
        <Button variant="danger" onClick={() => router.push('/user/profile')}>Cancel</Button>
      </Form>
    </>
  );
}

// <Form.Label>Photos</Form.Label>
// <input type="file" onChange={(e) => setImage(e.target.files[0])} />
// <Button onClick={uploadImage}>Upload</Button>

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
