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
import { getCategories } from '../api/categories';
import uploadPhoto from '../api/cloudinary';
import { createEvent, updateEvent } from '../api/events/eventData';
import { createImages, deleteImagesByEvent } from '../api/images/mergedImage';
import { getImagesByEvent } from '../api/images/imageData';
import { getCity, getPoi } from '../api/tom-tom';
import { getUser } from '../api/user/userData';

const initialState = {
  title: '',
  date: '',
  timeOfDay: '',
  category: '',
  location: 'Find Where You Were',
  uid: '',
  city: 'Search For Your City',
  description: '',
  starRating: 0,
  isPublic: false,
  eventOfDay: '',
  createdDate: Date.now(),
};

function EventForm({ obj }) {
  const { user } = useAuth();
  const [authUser, setAuthUser] = useState({});
  const [input, setInput] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const router = useRouter();

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
    console.warn(images);
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
          const imageObjects = images.map((image) => (
            {
              ...image,
              eventId: obj.firebaseKey,
              uid: user.uid,
            }
          ));
          createImages(imageObjects);
          router.push('/user/profile');
        });
      });
    } else {
      const payload = { ...input, uid: user.uid };
      createEvent(payload).then((response) => {
        const imageObjects = images.map((image) => (
          {
            ...image,
            eventId: response.firebaseKey,
            uid: user.uid,
          }
        ));
        createImages(imageObjects);
        router.push('/user/profile');
      });
    }
  };

  const uploadImage = async (e) => {
    if (e.target.files.length) {
      const payload = new FormData();
      payload.append('file', e.target.files[0]);
      payload.append('upload_preset', 'nofzejna');
      payload.append('cloud_name', 'twofiveclimb');
      await uploadPhoto(payload).then((data) => {
        const imageObj = {
          url: data.url,
          publicId: data.public_id,
          signature: data.signature,
        };
        setImages((prevState) => (
          [...prevState, imageObj]
        ));
      });
    }
  };

  const removePhoto = (url) => {
    setImages((prevState) => {
      const prevCopy = prevState;
      const index = prevCopy.findIndex((imageObj) => imageObj.url === url);
      prevCopy.splice(index, 1);
      return prevCopy;
    });
  };

  // TOM TOM API//
  const locationOptions = (target) => new Promise((resolve, reject) => {
    getPoi(target, authUser.lat, authUser.long).then((placesArr) => {
      resolve(placesArr.filter((place) => place.value.toLowerCase().includes(target.toLowerCase())));
    }).catch(reject);
  });

  const cityOptions = (target) => new Promise((resolve, reject) => {
    getCity(target).then((cityArr) => {
      resolve(cityArr.filter((city) => city.value.toLowerCase().includes(target.toLowerCase())));
    }).catch(reject);
  });

  const handleSelect = (selected) => {
    if (selected) {
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
    } else {
      setInput((prevState) => ({
        ...prevState,
        location: '',
      }));
    }
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

  useEffect(() => {
    if (obj.firebaseKey) {
      setInput(obj);
    }
    getImagesByEvent(obj.firebaseKey).then((imageArr) => {
      setImages(imageArr);
    });
    getCategories().then(setCategories);
    getUser(user.uid).then((userArr) => {
      setAuthUser(userArr[0]);
    });
  }, [obj]);

  return (
    <>
      <h4>{obj.firebaseKey ? 'Edit' : 'Create'} Event</h4>
      <Form className="event-from" onSubmit={handleSubmit}>
        <div className="event-form-columns">
          <div className="event-form-title-date">
            <div>
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={input.title} onChange={handleChange} type="text" placeholder="Title Your Event" required />
            </div>
            <div>
              <Form.Label>Date</Form.Label>
              <Form.Control name="date" value={input.date} onChange={handleChange} type="date" required />
            </div>
          </div>
          <div className="event-form-time-category">
            <div>
              <Form.Label>Time of Day</Form.Label>
              <Form.Select aria-label="Time of Day" name="timeOfDay" value={input.timeOfDay} onChange={handleChange} required>
                <option value="">Select a Time of Day</option>
                <option value="morning">Morning</option>
                <option value="day-time">Day Time</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </Form.Select>
            </div>
            <div>
              <Form.Label>Category</Form.Label>
              <Form.Select aria-label="category" name="category" value={input.category} onChange={handleChange} required>
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.category} value={category.category}>{category.category}</option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="event-form-location-city">
            <div>
              <Form.Label>Location</Form.Label>
              <AsyncCreatable
                classNamePrefix="select"
                backspaceRemovesValue
                isClearable
                onChange={handleSelect}
                value={{ label: input.location, value: input.location }}
                loadOptions={locationOptions}
                required
              />
            </div>
            <div>
              <Form.Label>City</Form.Label>
              <AsyncCreatable
                classNamePrefix="select"
                backspaceRemovesValue
                isClearable
                onChange={handleCitySelect}
                value={{ label: input.city, value: input.city }}
                loadOptions={cityOptions}
                required
              />
            </div>
          </div>
        </div>
        <div className="event-form-description">
          <Form.Label>Describe Your Experience</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={input.description} onChange={handleChange} placeholder="Tell the people about it" required />
        </div>
        <div className="event-Star-And-Public">
          <div className="event-form-star-rating-div">
            <Rating
              allowHover={false}
              showTooltip
              size={26}
              allowHalfIcon
              tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
              ratingValue={input.starRating}
              onClick={handleRating}
              tooltipStyle={{
                height: 'auto', width: 'auto', fontSize: '13px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
              }}
            />
          </div>
          <Form.Check
            className="event-form-public-check"
            name="isPublic"
            onChange={handleChange}
            checked={input.isPublic}
            type="switch"
            id="custom-switch"
            label="Make it Public ?"
          />
        </div>
        <div className="event-Image-Upload-Div">
          <Form.Label>Upload Photos</Form.Label>
          <Form.Control type="file" onChange={uploadImage} />
        </div>
        <div className="uploaded-Images-Div">
          {images.map((image) => (
            <div key={image.url} className="uploaded-Images-Container">
              <Image className="event-Form-Photos" rounded src={image.url} />
              <CloseButton onClick={() => removePhoto(image.url)} className="image-Delete" />
            </div>
          ))}
        </div>
        <div className="event-form-buttons">
          <Button className="submit-btn" type="submit" variant="success">{obj.firebaseKey ? 'Update' : 'Submit'}</Button>
          <Button className="cancel-btn" variant="danger" onClick={() => router.push('/user/profile')}>Cancel</Button>
        </div>
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
  }),
};

EventForm.defaultProps = {
  obj: initialState,
};

export default EventForm;
