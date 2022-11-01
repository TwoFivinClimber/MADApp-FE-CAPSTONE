import axios from 'axios';

const cloudUrl = 'https://api.cloudinary.com/v1_1/twofiveclimb/image/upload';

// const uploadPhoto = (payload) => new Promise((resolve, reject) => {
//   axios.post(`${cloudUrl}`, payload)
//     .then((response) => console.warn(response.data.url))
//     .catch(reject);
// });

const uploadPhoto = (payload) => new Promise((resolve, reject) => {
  axios.post(`${cloudUrl}`, payload)
    .then((response) => resolve(response.data))
    .catch(reject);
});

export default uploadPhoto;
