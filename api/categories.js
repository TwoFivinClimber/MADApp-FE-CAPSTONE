import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getCategories = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/categories.json`)
    .then((categories) => resolve(Object.values(categories.data)))
    .catch(reject);
});
export default getCategories;
