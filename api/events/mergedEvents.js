import { getPublicDays } from '../day/dayData';
import { deleteImage, getImagesByEvent } from '../images/imageData';
import {
  deleteSingleEvent, getEventsByDay, getPublicEvents, updateEvent,
} from './eventData';

const handleDayEvents = (dayFirebaseKey, eventsFbkArr) => new Promise((resolve, reject) => {
  const updateEvents = eventsFbkArr.map((firebaseKey) => updateEvent({ firebaseKey, eventOfDay: dayFirebaseKey }));
  Promise.all(updateEvents).then(() => {
    getEventsByDay(dayFirebaseKey).then((eventsArr) => {
      const removeDayArr = eventsArr.filter((event) => !eventsFbkArr.includes(event.firebaseKey));
      if (removeDayArr.length) {
        const update = { eventOfDay: '' };
        const removeTheDay = removeDayArr.map((evnt) => updateEvent({ ...evnt, ...update }));
        Promise.all(removeTheDay).then(resolve);
      }
    }).then(resolve).catch(reject);
  });
});

const deleteEvent = (firebaseKey) => new Promise((resolve, reject) => {
  getImagesByEvent(firebaseKey).then((imageArr) => {
    const deleteImages = imageArr.map((image) => deleteImage(image.firebaseKey));
    Promise.all(deleteImages).then(() => {
      resolve(deleteSingleEvent(firebaseKey));
    }).catch(reject);
  });
});

const getEventsAndDays = () => new Promise((resolve, reject) => {
  getPublicEvents().then((eventsArr) => {
    getPublicDays().then((daysArr) => {
      resolve([...eventsArr, ...daysArr]);
    }).catch(reject);
  });
});

const getEventCities = () => new Promise((resolve, reject) => {
  getPublicEvents().then((eventsArray) => {
    const returnArray = eventsArray.map((event) => ({
      name: 'city',
      value: event.city,
      label: event.city,
    }));
    resolve(returnArray);
  }).catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export {
  handleDayEvents, deleteEvent, getEventsAndDays, getEventCities,
};
