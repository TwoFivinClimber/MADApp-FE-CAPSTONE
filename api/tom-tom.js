import axios from 'axios';

const tomApi = 'h7BrcblaIvpXTTQtlrux4NjI1EMNNTnk';

// AUTOCOMPLETE EXAMPLE
// https://api.tomtom.com/search/2/autocomplete/pizza.json?key={Your_API_Key}&language=en-US

// FUZZY EXAMPLE
// https://api.tomtom.com/search/2/search/36.98844,-121.97483.json?key={Your_API_Key}

const getPoi = (input) => new Promise((resolve, reject) => {
  axios.get(`https://api.tomtom.com/search/2/search/${input}.json?countrySet=US&lat=36.188806&lon=-86.762462&language=en-US&extendedPostalCodesFor=POI&minFuzzyLevel=1&maxFuzzyLevel=2&idxSet=POI&view=Unified&relatedPois=off&key=${tomApi}`)
    .then((result) => {
      const poiArray = Object.values(result.data.results);
      // console.warn(poiArray);
      const returnArray = poiArray.map((poi) => (
        {
          value: poi.poi.name,
          label: poi.poi.name,
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
