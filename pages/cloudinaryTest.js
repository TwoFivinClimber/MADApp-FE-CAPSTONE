import React, { useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import uploadPhoto from '../api/cloudinary';

const CloudinaryTest = () => {
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  const uploadImage = () => {
    const payload = new FormData();
    payload.append('file', image);
    payload.append('upload_preset', 'nofzejna');
    payload.append('cloud_name', 'twofiveclimb');
    uploadPhoto(payload).then(setUrl);
  };

  return (
    <div>
      <div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <Button onClick={uploadImage}>Upload</Button>
      </div>
      <div>
        <h1>Uploaded image will be displayed here</h1>
        <Image src={url} />
      </div>
    </div>
  );
};
export default CloudinaryTest;
