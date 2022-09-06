import { getEventsByDay, updateEvent } from './eventData';

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
    }).catch(reject);
  });
});

// eslint-disable-next-line import/prefer-default-export
export { handleDayEvents };
