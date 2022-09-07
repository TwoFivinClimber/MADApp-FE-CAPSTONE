// import { clientCredentials } from '../../utils/client';
import { createImage, deleteImage, getImagesByEvent } from './imageData';

// const dbUrl = clientCredentials.databaseURL;

const createImages = (photoObjArr) => new Promise((resolve, reject) => {
  const uploadPhotos = photoObjArr.map((photo) => createImage(photo));
  Promise.all(uploadPhotos).then(resolve).catch(reject);
});

const deleteImagesByEvent = (firebaseKey) => new Promise((resolve, reject) => {
  getImagesByEvent(firebaseKey).then((imagesArr) => {
    const deleteTheImages = imagesArr.map((image) => deleteImage(image.firebaseKey));
    Promise.all(deleteTheImages).then(resolve);
  }).catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export { createImages, deleteImagesByEvent };
