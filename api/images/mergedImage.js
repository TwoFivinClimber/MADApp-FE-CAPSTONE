// import { clientCredentials } from '../../utils/client';
import { createImage } from './imageData';

// const dbUrl = clientCredentials.databaseURL;

const createImages = (photoObjArr) => new Promise((resolve, reject) => {
  const uploadPhotos = photoObjArr.map((photo) => createImage(photo));
  Promise.all(uploadPhotos).then(resolve).catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export { createImages };
