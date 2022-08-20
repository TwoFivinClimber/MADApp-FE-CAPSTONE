import React, { useState } from 'react';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();
  const [fileInputState] = useState({});
  // const [selectedFile, setSelectedFile] = useState('');

  const handleInput = (e) => {
    console.warn(e);
  };

  return (
    <div>
      <h1>Hello {user.displayName}! </h1>
      <h4>Cloudinary Test Code</h4>
      <form>
        <input
          className="photo-upload"
          type="file"
          name="image"
          value={fileInputState}
          onChange={handleInput}
        />
        <button className="submit button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
