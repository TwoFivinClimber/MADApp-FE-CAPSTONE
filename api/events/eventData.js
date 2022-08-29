import axios from 'axios';
import { clientCredentials } from '../../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getEvents = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/events.json`)
    .then((events) => resolve(events.data))
    .catch(reject);
});

const getSingleEvent = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/events/${firebaseKey}.json`)
    .then((eventObj) => resolve(eventObj.data))
    .catch(reject);
});

const getEventsByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/events.json?orderBy="uid"&equalTo="${uid}"`)
    .then((eventsArr) => resolve(Object.values(eventsArr.data)))
    .catch(reject);
});

const deleteEvent = (firebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/events/${firebaseKey}.json`)
    .then(resolve)
    .catch(reject);
});

const createEvent = (obj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/events.json`, obj)
    .then((response) => {
      const update = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/events/${response.data.name}.json`, update)
        .then((eventObj) => resolve(eventObj));
    }).catch(reject);
});

export {
  getEvents, createEvent, getSingleEvent, getEventsByUid, deleteEvent,
};
