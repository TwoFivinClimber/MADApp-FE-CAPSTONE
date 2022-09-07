import { getEventsByDay, updateEvent } from '../events/eventData';
import { getImagesByEvent } from '../images/imageData';
import { deleteSingleDay, getSingleDay } from './dayData';

const getDayPackage = (firebaseKey) => new Promise((resolve, reject) => {
  getSingleDay(firebaseKey).then((dayObj) => {
    getEventsByDay(firebaseKey).then((eventsArr) => {
      const imageUrlArr = [];
      const getImages = eventsArr.map((event) => getImagesByEvent(event.firebaseKey).then((imgObjArr) => {
        imgObjArr.map((obj) => imageUrlArr.push(obj.imageUrl));
      }));
      Promise.all(getImages).then(resolve({ ...dayObj, events: eventsArr, images: imageUrlArr }));
    }).catch(reject);
  });
});

const deleteDay = (firebaseKey) => new Promise((resolve, reject) => {
  getEventsByDay(firebaseKey).then((eventsArr) => {
    const update = { eventOfDay: '' };
    const removeEvents = eventsArr.map((event) => updateEvent({ ...event, ...update }));
    Promise.all(removeEvents).then(() => {
      resolve(deleteSingleDay(firebaseKey));
    }).catch(reject);
  });
});

// eslint-disable-next-line import/prefer-default-export
export { getDayPackage, deleteDay };
