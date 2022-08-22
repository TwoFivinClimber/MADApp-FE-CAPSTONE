import React, { useState } from 'react';
import { Button, Image } from 'react-bootstrap';

const CloudinaryTest = () => {
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  const uploadImage = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'spzzmri7');
    data.append('cloud_name', 'ds4atmcju');
    fetch('https://api.cloudinary.com/v1_1/ds4atmcju/image/upload', {
      method: 'post',
      body: data,
    })
      .then((resp) => resp.json())
      // eslint-disable-next-line no-shadow
      .then((imgObj) => {
        setUrl(imgObj.url);
      })
      .catch((err) => console.warn(err));
    console.warn(data);
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
