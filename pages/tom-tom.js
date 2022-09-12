/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import AsyncSelect from 'react-select/async';
import getPoi from '../api/tom-tom';

function tomTom() {
  // const [results, setResults] = useState([]);
  // const [options, setOptions] = useState([]);
  // const testTom = () => {
  //   getPoi().then(setResults);
  // };

  // useEffect(() => {
  //   testTom();
  // }, []);

  const promiseOptions = (inputValue) => new Promise((resolve, reject) => {
    getPoi(inputValue).then((result) => {
      resolve(result);
    }).catch(reject);
  });

  const handleSelect = (value) => {
    console.warn(value);
  };

  return (
    <div>
      <h4>Results</h4>
      {/* <ul>
        {results.map((result) => (
          <li>{result.poi.name}</li>
        ))}
      </ul> */}
      <AsyncSelect isClearable onChange={handleSelect} loadOptions={promiseOptions} />
    </div>
  );
}

export default tomTom;
