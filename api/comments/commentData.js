import axios from 'axios';
import { clientCredentials } from '../../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createComment = (commentObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/comments.json`, commentObj)
    .then((response) => {
      const payload = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/comments/${response.data.name}.json`, payload)
        .then((patchResponse) => resolve(patchResponse.data));
    }).catch(reject);
});

const getComments = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/comments.json?orderBy="eventId"&equalTo="${firebaseKey}"`)
    .then((response) => resolve(Object.values(response.data)))
    .catch(reject);
});

const getSingleComment = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/comments.json?orderBy="commentFirebaseKey"&equalTo="${firebaseKey}"`)
    .then((response) => resolve(Object.values(response.data)))
    .catch(reject);
});

const updateComment = (commentObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/comments/${commentObj.firebaseKey}.json`, commentObj)
    .then(() => {
      getComments(commentObj.videoFirebaseKey).then(resolve);
    })
    .catch(reject);
});

const deleteComment = (commentfirebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/comments/${commentfirebaseKey}.json`)
    .then(() => {
      getComments().then((commentsArray) => resolve(commentsArray));
    })
    .catch((error) => reject(error));
});

export {
  getComments, updateComment, deleteComment, createComment, getSingleComment,
};
