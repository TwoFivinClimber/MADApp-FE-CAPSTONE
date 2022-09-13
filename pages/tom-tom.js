/* eslint-disable react-hooks/rules-of-hooks */
// import React, { useState, useEffect } from 'react';
import useReactIpLocation from 'react-ip-details';
import AsyncSelect from 'react-select/async';
import getPoi from '../api/tom-tom';

function tomTom() {
  const {
    geoLocationPosition,
  } = useReactIpLocation({ onlyPosition: true });

  console.warn(geoLocationPosition);
  // const setLatLong = () => {
  //   setLat(ipResponse.latitude);
  //   setlong(ipResponse.longitude);
  // };
  // const [results, setResults] = useState([]);
  // const [options, setOptions] = useState([]);
  // const testTom = () => {
  //   getPoi().then(setResults);
  // };

  // useEffect(() => {
  //   setLatLong();
  // }, [ipResponse]);

  const promiseOptions = (inputValue) => new Promise((resolve, reject) => {
    getPoi(inputValue).then((result) => {
      resolve(result);
    }).catch(reject);
  });

  const handleSelect = (value) => {
    console.warn(value);
  };

  return (
    <>
      <div>
        <h4>Results</h4>
        {/* <ul>
        {results.map((result) => (
          <li>{result.poi.name}</li>
        ))}
      </ul> */}
        <AsyncSelect isClearable onChange={handleSelect} loadOptions={promiseOptions} />
      </div>
    </>
  );
}

export default tomTom;
