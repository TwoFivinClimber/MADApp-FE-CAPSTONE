import axios from 'axios';
// import cloudinary from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_API_KEY,
//   api_secret: process.env.NEXT_PUBLIC_API_SECRET,
// });

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

const cloudDestroy = 'https://api.cloudinary.com/v1_1/twofiveclimb/image/destroy';

const deletePhoto = (data) => new Promise((resolve) => {
  axios.post(`${cloudDestroy}`, data)
    .then(resolve)
    .catch((error) => console.warn(error));
});

export { uploadPhoto, deletePhoto };
