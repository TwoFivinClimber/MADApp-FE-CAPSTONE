import axios from 'axios';
import { clientCredentials } from '../utils/client';

const tomApi = clientCredentials.tomTomApi;

const getPoi = (input) => new Promise((resolve, reject) => {
  axios.get(`https://api.tomtom.com/search/2/search/${input}.json?countrySet=US&lat=36.188806&lon=-86.762462&language=en-US&extendedPostalCodesFor=POI&minFuzzyLevel=1&maxFuzzyLevel=2&idxSet=POI&view=Unified&relatedPois=off&key=${tomApi}`)
    .then((result) => {
      const poiArray = Object.values(result.data.results);
      const returnArray = poiArray.map((poi) => (
        {
          value: poi.poi.name,
          label: `${poi.poi.name}, (${poi.address.localName})`,
          city: poi.address.localName,
          state: poi.address.countrySubdivision,
          name: 'location',
        }
      ));
      resolve(returnArray);
    })
    .catch(reject);
});

export default getPoi;
