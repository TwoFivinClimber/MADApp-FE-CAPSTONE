/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import getPoi from '../api/tom-tom';

function tomTom() {
  const [results, setResults] = useState([]);
  const testTom = () => {
    getPoi().then(setResults);
  };

  useEffect(() => {
    testTom();
  }, []);

  return (
    <div>
      <h4>Results</h4>
      <ul>
        {results.map((result) => (
          <li>{result.poi.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default tomTom;
