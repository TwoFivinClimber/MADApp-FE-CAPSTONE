import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getCategories = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/categories.json`)
    .then((categories) => resolve(Object.values(categories.data)))
    .catch(reject);
});

const getCategorySelect = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/categories.json`)
    .then((categories) => {
      const categoryArray = Object.values(categories.data);
      const returnArray = categoryArray.map((cat) => ({
        name: 'category',
        label: cat.category,
        value: cat.category,
      }));
      resolve(returnArray);
    }).catch(reject);
});

export { getCategories, getCategorySelect };
