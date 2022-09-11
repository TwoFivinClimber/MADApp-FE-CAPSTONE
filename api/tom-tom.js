import axios from 'axios';

const tomApi = 'h7BrcblaIvpXTTQtlrux4NjI1EMNNTnk';

// AUTOCOMPLETE EXAMPLE
// https://api.tomtom.com/search/2/autocomplete/pizza.json?key={Your_API_Key}&language=en-US

// FUZZY EXAMPLE
// https://api.tomtom.com/search/2/search/36.98844,-121.97483.json?key={Your_API_Key}

const getPoi = () => new Promise((resolve, reject) => {
  axios.get(`https://api.tomtom.com/search/2/search/Brooklyn%20Bowl.json?countrySet=US&lat=36.188806&lon=-86.762462&language=en-US&extendedPostalCodesFor=POI&minFuzzyLevel=1&maxFuzzyLevel=1&idxSet=POI&view=Unified&relatedPois=off&key=${tomApi}`)
    .then((result) => resolve(Object.values(result.data.results)))
    .catch(reject);
});

export default getPoi;
