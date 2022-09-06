import axios from 'axios';
import { clientCredentials } from '../../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createDay = (obj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/days.json`, obj)
    .then((response) => {
      const update = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/days/${response.data.name}.json`, update)
        .then((dayObj) => resolve(dayObj.data));
    }).catch(reject);
});

const getSingleDay = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/days/${firebaseKey}.json`)
    .then((dayObj) => resolve(dayObj.data))
    .catch(reject);
});

const updateDay = (obj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/days/${obj.firebaseKey}.json`, obj)
    .then(resolve)
    .catch(reject);
});

const getPublicDays = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/days.json?orderBy="isPublic"&equalTo=true`)
    .then((daysArr) => resolve(Object.values(daysArr.data)))
    .catch(reject);
});

const getDaysbyUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/days.json?orderBy="uid"&equalTo="${uid}"`)
    .then((daysArr) => resolve(Object.values(daysArr.data)))
    .catch(reject);
});

const deleteSingleDay = (firebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/days/${firebaseKey}.json`)
    .then(resolve)
    .catch(reject);
});

export {
  createDay, updateDay, getPublicDays, getDaysbyUid, deleteSingleDay, getSingleDay,
};
